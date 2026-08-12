from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import WeatherObservation
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/weather")
def get_weather(db: Session = Depends(get_db)):
    observations = db.query(WeatherObservation).filter(
        WeatherObservation.location_id == "downtown"
    ).order_by(WeatherObservation.date).all()

    return {
        "forecast": [
            {
                "date": str(w.date.date()),
                "temperature_f": w.temperature_f,
                "condition": w.condition,
                "rain_probability": w.rain_probability
            }
            for w in observations
        ]
    }
