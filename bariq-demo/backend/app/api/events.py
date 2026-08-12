"""
Local Events API — Uses Ticketmaster Discovery API v2 when API key is available,
falls back to demo data otherwise.

Ticketmaster API Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

Set TICKETMASTER_API_KEY in .env to enable live event data.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LocalEvent
import os
import httpx
from datetime import datetime, timedelta

router = APIRouter()

TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY", "")
TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2"


async def fetch_ticketmaster_events(lat: float, lon: float, radius_miles: int = 5):
    """Fetch events from Ticketmaster Discovery API v2."""
    if not TICKETMASTER_API_KEY:
        return None

    today = datetime.utcnow()
    start_date = today.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_date = (today + timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "latlong": f"{lat},{lon}",
        "radius": str(radius_miles),
        "unit": "miles",
        "startDateTime": start_date,
        "endDateTime": end_date,
        "size": "10",
        "sort": "date,asc",
        "classificationName": "Music,Sports,Arts & Theatre,Festival"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{TICKETMASTER_BASE_URL}/events.json", params=params)
            if response.status_code == 200:
                data = response.json()
                events = []
                embedded = data.get("_embedded", {})
                for event in embedded.get("events", []):
                    venue = event.get("_embedded", {}).get("venues", [{}])[0]
                    events.append({
                        "id": event.get("id", ""),
                        "name": event.get("name", ""),
                        "date": event.get("dates", {}).get("start", {}).get("localDate", ""),
                        "time": event.get("dates", {}).get("start", {}).get("localTime", ""),
                        "venue": venue.get("name", ""),
                        "city": venue.get("city", {}).get("name", ""),
                        "category": event.get("classifications", [{}])[0].get("segment", {}).get("name", "Other"),
                        "expected_attendance": _estimate_attendance(venue),
                        "distance_miles": float(venue.get("distance", 0)) if venue.get("distance") else None,
                        "url": event.get("url", ""),
                        "image": _get_event_image(event)
                    })
                return events
    except Exception as e:
        print(f"Ticketmaster API error: {e}")
        return None

    return None


def _estimate_attendance(venue: dict) -> int:
    """Estimate attendance from venue capacity or default."""
    capacity = venue.get("generalInfo", {}).get("generalRule", "")
    # Try to extract capacity from venue data
    if venue.get("boxOfficeInfo"):
        return 15000  # Large venue
    return 5000  # Default estimate


def _get_event_image(event: dict) -> str:
    """Get best event image URL."""
    images = event.get("images", [])
    for img in images:
        if img.get("ratio") == "16_9" and img.get("width", 0) >= 640:
            return img.get("url", "")
    return images[0].get("url", "") if images else ""


@router.get("/events")
async def get_events(db: Session = Depends(get_db)):
    # Downtown Social coordinates (Austin, TX demo)
    lat, lon = 30.2672, -97.7431

    # Try Ticketmaster API first
    live_events = await fetch_ticketmaster_events(lat, lon)

    if live_events:
        return {
            "source": "ticketmaster_live",
            "source_label": "Ticketmaster Discovery API v2",
            "source_url": "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
            "events": live_events
        }

    # Fall back to demo data
    events = db.query(LocalEvent).order_by(LocalEvent.date).all()
    return {
        "source": "demo_data",
        "source_label": "Demo Data (set TICKETMASTER_API_KEY for live events)",
        "source_url": "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
        "events": [
            {
                "id": e.id,
                "name": e.name,
                "date": str(e.date.date()),
                "expected_attendance": e.expected_attendance,
                "distance_miles": e.distance_miles,
                "category": e.category,
                "location_id": e.location_id,
                "venue": "Downtown Austin",
                "url": ""
            }
            for e in events
        ]
    }


@router.get("/events/source")
async def get_events_source():
    """Show where event data is being fetched from."""
    if TICKETMASTER_API_KEY:
        return {
            "source": "ticketmaster_live",
            "api": "Ticketmaster Discovery API v2",
            "documentation": "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
            "status": "connected",
            "key_configured": True
        }
    return {
        "source": "demo_data",
        "api": "Ticketmaster Discovery API v2",
        "documentation": "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
        "status": "not_connected",
        "key_configured": False,
        "how_to_enable": "Set TICKETMASTER_API_KEY in .env file. Get a free key at https://developer.ticketmaster.com/"
    }
