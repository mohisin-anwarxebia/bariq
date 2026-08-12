from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app.seed import seed_database

router = APIRouter()


@router.post("/demo/reset")
def reset_demo(db: Session = Depends(get_db)):
    """Reset the demo database to initial state."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database(db)
    return {"status": "success", "message": "Demo data has been reset."}
