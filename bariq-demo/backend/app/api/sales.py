from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import SalesTransaction, Product
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/sales")
def get_sales(db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)

    sales = db.query(
        SalesTransaction.date,
        func.sum(SalesTransaction.revenue).label("revenue"),
        func.sum(SalesTransaction.cost).label("cost"),
        func.sum(SalesTransaction.quantity).label("qty")
    ).filter(SalesTransaction.date >= week_ago).group_by(SalesTransaction.date).all()

    daily = [{"date": str(s.date.date()), "revenue": round(s.revenue, 2), "cost": round(s.cost, 2), "quantity": s.qty} for s in sales]

    return {"daily_sales": daily}


@router.get("/revenue")
def get_revenue(db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)

    # Weekly
    weekly = db.query(
        func.sum(SalesTransaction.revenue),
        func.sum(SalesTransaction.cost),
        func.count(SalesTransaction.id),
        func.sum(SalesTransaction.discount)
    ).filter(SalesTransaction.date >= week_ago).first()

    # Monthly
    monthly = db.query(
        func.sum(SalesTransaction.revenue),
        func.sum(SalesTransaction.cost),
        func.count(SalesTransaction.id)
    ).filter(SalesTransaction.date >= month_ago).first()

    # Top products
    top_products = db.query(
        Product.name,
        Product.category,
        func.sum(SalesTransaction.revenue).label("revenue"),
        func.sum(SalesTransaction.quantity).label("qty")
    ).join(Product).filter(
        SalesTransaction.date >= week_ago
    ).group_by(Product.id).order_by(func.sum(SalesTransaction.revenue).desc()).limit(10).all()

    weekly_rev = weekly[0] or 0
    weekly_cost = weekly[1] or 0

    return {
        "weekly": {
            "total_revenue": round(weekly_rev, 2),
            "total_cost": round(weekly_cost, 2),
            "gross_margin": round(((weekly_rev - weekly_cost) / weekly_rev) * 100, 1) if weekly_rev else 0,
            "orders": weekly[2] or 0,
            "discounts": round(weekly[3] or 0, 2),
            "average_check": round(weekly_rev / max(weekly[2] or 1, 1), 2)
        },
        "monthly": {
            "total_revenue": round(monthly[0] or 0, 2),
            "total_cost": round(monthly[1] or 0, 2),
            "orders": monthly[2] or 0
        },
        "top_products": [
            {"name": p.name, "category": p.category, "revenue": round(p.revenue, 2), "quantity": p.qty}
            for p in top_products
        ]
    }
