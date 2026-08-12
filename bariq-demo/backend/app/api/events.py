from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LocalEvent

router = APIRouter()


@router.get("/events")
def get_events(db: Session = Depends(get_db)):
    events = db.query(LocalEvent).order_by(LocalEvent.date).all()
    return {
        "events": [
            {
                "id": e.id,
                "name": e.name,
                "date": str(e.date.date()),
                "expected_attendance": e.expected_attendance,
                "distance_miles": e.distance_miles,
                "category": e.category,
                "location_id": e.location_id
            }
            for e in events
        ]
    }
