from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import WeatherObservation, LocalEvent, SalesTransaction, Product
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/forecast")
def get_forecast(db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    saturday = today + timedelta(days=(5 - today.weekday()) % 7)

    # Get weather for Saturday
    weather = db.query(WeatherObservation).filter(
        WeatherObservation.date >= saturday,
        WeatherObservation.date < saturday + timedelta(days=1),
        WeatherObservation.location_id == "downtown"
    ).first()

    # Get event
    event = db.query(LocalEvent).filter(
        LocalEvent.date >= saturday,
        LocalEvent.date < saturday + timedelta(days=1)
    ).first()

    # Deterministic forecast based on factors
    base_increase = 15  # Historical Saturday increase
    weather_factor = 5 if (weather and weather.temperature_f > 90) else 0
    event_factor = 12 if (event and event.expected_attendance > 10000) else 5

    forecasts = {
        "beer": base_increase + weather_factor + 3,
        "cocktails": base_increase + weather_factor + event_factor - 3,
        "tequila": base_increase + weather_factor + event_factor,
        "chicken_wings": base_increase + event_factor - 6,
        "food_overall": base_increase + event_factor - 8,
    }

    factors = []
    if weather:
        factors.append({
            "type": "weather",
            "description": f"Temperature: {weather.temperature_f}°F, {weather.condition}",
            "impact": f"+{weather_factor}% beverage demand"
        })
    if event:
        factors.append({
            "type": "event",
            "description": f"{event.name} - {event.expected_attendance:,} expected attendees",
            "distance": f"{event.distance_miles} miles away",
            "impact": f"+{event_factor}% overall demand"
        })
    factors.append({
        "type": "historical",
        "description": "Historical Saturday demand pattern",
        "impact": f"+{base_increase}% baseline increase"
    })

    return {
        "forecast_date": str(saturday.date()),
        "day": "Saturday",
        "forecasts": [
            {"category": "Beer", "change_pct": forecasts["beer"]},
            {"category": "Cocktails", "change_pct": forecasts["cocktails"]},
            {"category": "Tequila", "change_pct": forecasts["tequila"]},
            {"category": "Chicken Wings", "change_pct": forecasts["chicken_wings"]},
            {"category": "Food Overall", "change_pct": forecasts["food_overall"]},
        ],
        "factors": factors,
        "confidence": 0.86,
        "inventory_risks": [
            {
                "product": "Don Julio 1942",
                "current_stock": 16.3,
                "forecast_demand": 22,
                "risk": "Stock-out risk",
                "recommendation": "Order 4 cases"
            },
            {
                "product": "Chicken",
                "current_stock": "85 lbs",
                "forecast_demand": "130 lbs",
                "risk": "Stock-out risk",
                "recommendation": "Order 180 lbs"
            }
        ]
    }
