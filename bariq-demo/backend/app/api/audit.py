from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditEvent

router = APIRouter()


@router.get("/audit")
def get_audit(db: Session = Depends(get_db)):
    events = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(50).all()
    return {
        "events": [
            {
                "id": e.id,
                "user": e.user_name,
                "action": e.action,
                "details": e.details,
                "context": e.context,
                "timestamp": str(e.timestamp)
            }
            for e in events
        ]
    }
