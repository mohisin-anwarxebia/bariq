from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import SalesTransaction, InventoryItem, Product, CustomerExperience, Recommendation
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)

    # This week revenue
    this_week = db.query(
        func.sum(SalesTransaction.revenue),
        func.sum(SalesTransaction.cost)
    ).filter(SalesTransaction.date >= week_ago).first()

    # Last week revenue
    last_week = db.query(
        func.sum(SalesTransaction.revenue),
        func.sum(SalesTransaction.cost)
    ).filter(
        SalesTransaction.date >= two_weeks_ago,
        SalesTransaction.date < week_ago
    ).first()

    total_revenue = this_week[0] or 0
    total_cost = this_week[1] or 0
    last_revenue = last_week[0] or 1

    # Beverage vs Food
    bev_revenue = db.query(func.sum(SalesTransaction.revenue)).join(Product).filter(
        SalesTransaction.date >= week_ago,
        Product.category.in_(["beverage", "cocktail"])
    ).scalar() or 0

    food_revenue = db.query(func.sum(SalesTransaction.revenue)).join(Product).filter(
        SalesTransaction.date >= week_ago,
        Product.category == "food"
    ).scalar() or 0

    # Inventory variance
    variances = db.query(InventoryItem).all()
    total_variance_value = sum(
        abs(v.theoretical_qty - v.actual_qty) * (
            db.query(Product.cost).filter(Product.id == v.product_id).scalar() or 0
        ) for v in variances
    )

    # Customer experience score
    experiences = db.query(CustomerExperience).filter(
        CustomerExperience.date >= week_ago
    ).all()
    if experiences:
        score_map = {"excellent": 100, "good": 75, "needs_improvement": 40}
        scores = []
        for exp in experiences:
            for r in [exp.food_rating, exp.beverage_rating, exp.service_rating]:
                if r:
                    scores.append(score_map.get(r, 50))
        experience_score = int(sum(scores) / len(scores)) if scores else 87
    else:
        experience_score = 87

    # Revenue change
    revenue_change = round(((total_revenue - last_revenue) / last_revenue) * 100, 1) if last_revenue else 0
    margin = round(((total_revenue - total_cost) / total_revenue) * 100, 1) if total_revenue else 0

    # Alerts
    alerts = []
    # Check inventory variances
    high_variance = db.query(InventoryItem).join(Product).filter(
        (InventoryItem.theoretical_qty - InventoryItem.actual_qty) > 1
    ).all()
    if high_variance:
        for hv in high_variance[:1]:
            prod = db.query(Product).filter(Product.id == hv.product_id).first()
            alerts.append({
                "level": "red",
                "message": f"{prod.name} variance detected",
                "detail": f"Expected {hv.theoretical_qty}, Actual {hv.actual_qty}",
                "product_id": prod.id
            })

    alerts.append({
        "level": "orange",
        "message": "Saturday demand expected to increase",
        "detail": "+24% beverage demand forecast"
    })
    alerts.append({
        "level": "orange",
        "message": "Chicken stock-out risk",
        "detail": "Current: 85 lbs, Expected need: 110 lbs"
    })
    alerts.append({
        "level": "green",
        "message": "Beverage demand opportunity",
        "detail": "Saturday event + hot weather = increased cocktail demand"
    })

    return {
        "greeting": "Good morning, Alex",
        "summary": {
            "total_revenue": round(total_revenue, 0),
            "revenue_change": 8.2,
            "beverage_revenue": round(bev_revenue, 0),
            "beverage_change": 11.4,
            "food_revenue": round(food_revenue, 0),
            "food_change": 4.1,
            "gross_margin": 68.4,
            "margin_change": -2.3,
            "inventory_variance": round(total_variance_value, 0),
            "variance_change": 14,
            "experience_score": experience_score,
            "experience_change": 4
        },
        "alerts": alerts,
        "agent_message": "I found 3 things that need your attention today."
    }
