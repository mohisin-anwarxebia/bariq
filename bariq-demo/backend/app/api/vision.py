from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


@router.post("/vision/analyze")
def analyze_bottle(image: Optional[UploadFile] = File(None)):
    """Mock vision analysis - always returns Don Julio 1942 demo data."""
    return {
        "bottle": {
            "name": "Don Julio 1942",
            "product_id": "don-julio-1942",
            "confidence": 0.96
        },
        "fill_level": {
            "percentage": 65,
            "confidence": 0.84
        },
        "measurements": {
            "bottle_size_ml": 750,
            "estimated_remaining_ml": 487,
            "standard_pour_ml": 30,
            "estimated_servings": 16
        },
        "comparison": {
            "vision_servings": 16,
            "inventory_servings": 18,
            "pos_servings": 17,
            "variance_detected": True,
            "confidence": 0.84,
            "recommendation": "Perform a manual bottle count and review pour controls during peak periods."
        }
    }
