"""BARIQ - Beverage Analytics & Revenue Intelligence Quad - Backend"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.api import dashboard, inventory, sales, forecast, weather, events, experience, feedback, vision, agent, recommendations, audit, demo, live_data

app = FastAPI(
    title="BARIQ API",
    description="Beverage Analytics & Revenue Intelligence Quad",
    version="1.0.0-demo"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(inventory.router, prefix="/api", tags=["Inventory"])
app.include_router(sales.router, prefix="/api", tags=["Sales"])
app.include_router(forecast.router, prefix="/api", tags=["Forecast"])
app.include_router(weather.router, prefix="/api", tags=["Weather"])
app.include_router(events.router, prefix="/api", tags=["Events"])
app.include_router(experience.router, prefix="/api", tags=["Experience"])
app.include_router(feedback.router, prefix="/api", tags=["Feedback"])
app.include_router(vision.router, prefix="/api", tags=["Vision"])
app.include_router(agent.router, prefix="/api", tags=["Agent"])
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(audit.router, prefix="/api", tags=["Audit"])
app.include_router(demo.router, prefix="/api", tags=["Demo"])
app.include_router(live_data.router, prefix="/api", tags=["Live Data"])


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "bariq-demo", "version": "1.0.0"}
