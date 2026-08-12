from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Recommendation, PurchaseOrder, AuditEvent
from datetime import datetime
import random

router = APIRouter()


@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    recs = db.query(Recommendation).order_by(Recommendation.created_at.desc()).all()
    return {
        "recommendations": [
            {
                "id": r.id,
                "title": r.title,
                "description": r.description,
                "category": r.category,
                "impact_value": r.impact_value,
                "confidence": r.confidence,
                "status": r.status,
                "location_id": r.location_id,
                "created_at": str(r.created_at)
            }
            for r in recs
        ]
    }


@router.post("/recommendations/{rec_id}/approve")
def approve_recommendation(rec_id: str, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        return {"error": "Recommendation not found"}

    rec.status = "approved"

    # Create a mock PO if it's an inventory recommendation
    po = None
    if rec.category == "inventory":
        po_number = f"PO-2026-{random.randint(100, 999):05d}"
        po = PurchaseOrder(
            po_number=po_number,
            product_id="don-julio-1942",
            location_id=rec.location_id or "downtown",
            quantity=4,
            unit="cases",
            total_cost=rec.impact_value or 1920,
            status="created",
            created_by="Alex Morgan"
        )
        db.add(po)

    # Audit
    db.add(AuditEvent(
        user_name="Alex Morgan",
        action="recommendation_approved",
        details=f"Approved: {rec.title}" + (f" | PO: {po.po_number}" if po else ""),
        context=f"recommendation_id={rec_id}"
    ))

    db.commit()

    result = {
        "status": "approved",
        "message": "Action completed successfully."
    }
    if po:
        result["purchase_order"] = {
            "po_number": po.po_number,
            "status": "Created",
            "amount": po.total_cost
        }

    return result
