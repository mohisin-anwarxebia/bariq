from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models import CustomerExperience
from datetime import datetime
import json

router = APIRouter()


class FeedbackRequest(BaseModel):
    location_id: str
    customer_name: str
    food_rating: Optional[str] = None
    beverage_rating: Optional[str] = None
    service_rating: Optional[str] = None
    wait_rating: Optional[str] = None
    comment: Optional[str] = None
    products_ordered: Optional[list] = []


@router.get("/feedback")
def get_feedback(db: Session = Depends(get_db)):
    experiences = db.query(CustomerExperience).order_by(
        CustomerExperience.date.desc()
    ).limit(20).all()

    return {
        "feedback": [
            {
                "id": exp.id,
                "customer_name": exp.customer_name,
                "location_id": exp.location_id,
                "food_rating": exp.food_rating,
                "beverage_rating": exp.beverage_rating,
                "service_rating": exp.service_rating,
                "wait_rating": exp.wait_rating,
                "comment": exp.comment,
                "products_ordered": json.loads(exp.products_ordered) if exp.products_ordered else [],
                "verified": exp.verified,
                "date": str(exp.date)
            }
            for exp in experiences
        ]
    }


@router.post("/feedback")
def submit_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    exp = CustomerExperience(
        location_id=req.location_id,
        customer_name=req.customer_name,
        food_rating=req.food_rating,
        beverage_rating=req.beverage_rating,
        service_rating=req.service_rating,
        wait_rating=req.wait_rating,
        comment=req.comment,
        products_ordered=json.dumps(req.products_ordered),
        verified=True,
        date=datetime.utcnow()
    )
    db.add(exp)
    db.commit()
    return {"status": "success", "id": exp.id}
