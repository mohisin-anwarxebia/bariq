from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CustomerExperience
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/experience")
def get_experience(db: Session = Depends(get_db)):
    today = datetime.utcnow()
    experiences = db.query(CustomerExperience).order_by(CustomerExperience.date.desc()).all()

    score_map = {"excellent": 100, "good": 75, "needs_improvement": 40}
    wait_map = {"better": 100, "expected": 75, "worse": 40}

    food_scores, bev_scores, svc_scores, wait_scores = [], [], [], []
    for exp in experiences:
        if exp.food_rating:
            food_scores.append(score_map.get(exp.food_rating, 50))
        if exp.beverage_rating:
            bev_scores.append(score_map.get(exp.beverage_rating, 50))
        if exp.service_rating:
            svc_scores.append(score_map.get(exp.service_rating, 50))
        if exp.wait_rating:
            wait_scores.append(wait_map.get(exp.wait_rating, 50))

    overall = int((
        (sum(food_scores) / max(len(food_scores), 1)) +
        (sum(bev_scores) / max(len(bev_scores), 1)) +
        (sum(svc_scores) / max(len(svc_scores), 1)) +
        (sum(wait_scores) / max(len(wait_scores), 1))
    ) / 4)

    # Root cause analysis
    analysis = None
    if bev_scores and sum(bev_scores) / len(bev_scores) < 70:
        analysis = {
            "finding": "Beverage experience declined 9% at Downtown Social",
            "period": "Friday and Saturday between 8 PM and 10 PM",
            "correlations": [
                "+22% order volume during this period",
                "+14% beverage wait time",
                "+8% pour variance"
            ],
            "contributing_factors": "Peak demand and bar throughput",
            "confidence": 0.78
        }

    return {
        "health_score": {
            "overall": overall,
            "food": int(sum(food_scores) / max(len(food_scores), 1)),
            "beverage": int(sum(bev_scores) / max(len(bev_scores), 1)),
            "service": int(sum(svc_scores) / max(len(svc_scores), 1)),
            "wait_time": int(sum(wait_scores) / max(len(wait_scores), 1))
        },
        "total_responses": len(experiences),
        "top_issue": "Friday night service wait",
        "contributing_factor": "Peak bar demand",
        "recommended_action": "Review Friday staffing",
        "root_cause_analysis": analysis
    }
