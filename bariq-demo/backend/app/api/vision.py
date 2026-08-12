from fastapi import APIRouter, UploadFile, File
from typing import List, Optional
import random

router = APIRouter()

# Mock bottle database for demo — simulates recognition of different bottles
BOTTLE_DATABASE = {
    "don-julio-1942": {
        "name": "Don Julio 1942",
        "product_id": "don-julio-1942",
        "bottle_size_ml": 750,
        "standard_pour_ml": 30,
        "cost": 145.00,
        "price": 22.00,
    },
    "patron-silver": {
        "name": "Patron Silver",
        "product_id": "patron-silver",
        "bottle_size_ml": 750,
        "standard_pour_ml": 30,
        "cost": 48.00,
        "price": 14.00,
    },
    "titos-vodka": {
        "name": "Tito's Vodka",
        "product_id": "titos-vodka",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 22.00,
        "price": 11.00,
    },
    "grey-goose": {
        "name": "Grey Goose",
        "product_id": "grey-goose",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 35.00,
        "price": 14.00,
    },
    "jameson": {
        "name": "Jameson",
        "product_id": "jameson",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 28.00,
        "price": 12.00,
    },
    "woodford-reserve": {
        "name": "Woodford Reserve",
        "product_id": "woodford-reserve",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 38.00,
        "price": 14.00,
    },
    "hendricks-gin": {
        "name": "Hendrick's Gin",
        "product_id": "hendricks-gin",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 36.00,
        "price": 14.00,
    },
    "jack-daniels": {
        "name": "Jack Daniel's",
        "product_id": "jack-daniels",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 24.00,
        "price": 10.00,
    },
    "tanqueray": {
        "name": "Tanqueray",
        "product_id": "tanqueray",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 26.00,
        "price": 12.00,
    },
    "bacardi": {
        "name": "Bacardi",
        "product_id": "bacardi",
        "bottle_size_ml": 750,
        "standard_pour_ml": 45,
        "cost": 18.00,
        "price": 10.00,
    },
}

# Simulated fill levels and variances per bottle for demo
MOCK_ANALYSIS = {
    "don-julio-1942": {"fill_pct": 65, "fill_confidence": 0.84, "inv_servings": 18, "pos_servings": 17},
    "patron-silver": {"fill_pct": 72, "fill_confidence": 0.87, "inv_servings": 22, "pos_servings": 21},
    "titos-vodka": {"fill_pct": 55, "fill_confidence": 0.81, "inv_servings": 15, "pos_servings": 14},
    "grey-goose": {"fill_pct": 80, "fill_confidence": 0.89, "inv_servings": 12, "pos_servings": 12},
    "jameson": {"fill_pct": 45, "fill_confidence": 0.82, "inv_servings": 10, "pos_servings": 9},
    "woodford-reserve": {"fill_pct": 70, "fill_confidence": 0.86, "inv_servings": 11, "pos_servings": 11},
    "hendricks-gin": {"fill_pct": 58, "fill_confidence": 0.83, "inv_servings": 9, "pos_servings": 8},
    "jack-daniels": {"fill_pct": 40, "fill_confidence": 0.80, "inv_servings": 8, "pos_servings": 7},
    "tanqueray": {"fill_pct": 85, "fill_confidence": 0.91, "inv_servings": 14, "pos_servings": 14},
    "bacardi": {"fill_pct": 62, "fill_confidence": 0.85, "inv_servings": 12, "pos_servings": 11},
}


def _analyze_single_bottle(bottle_key: str, filename: str = "") -> dict:
    """Generate analysis for a single bottle."""
    bottle = BOTTLE_DATABASE[bottle_key]
    mock = MOCK_ANALYSIS[bottle_key]

    fill_pct = mock["fill_pct"]
    remaining_ml = int(bottle["bottle_size_ml"] * fill_pct / 100)
    vision_servings = int(remaining_ml / bottle["standard_pour_ml"])

    variance_detected = vision_servings != mock["inv_servings"]

    return {
        "filename": filename,
        "bottle": {
            "name": bottle["name"],
            "product_id": bottle["product_id"],
            "confidence": round(random.uniform(0.92, 0.98), 2)
        },
        "fill_level": {
            "percentage": fill_pct,
            "confidence": mock["fill_confidence"]
        },
        "measurements": {
            "bottle_size_ml": bottle["bottle_size_ml"],
            "estimated_remaining_ml": remaining_ml,
            "standard_pour_ml": bottle["standard_pour_ml"],
            "estimated_servings": vision_servings
        },
        "comparison": {
            "vision_servings": vision_servings,
            "inventory_servings": mock["inv_servings"],
            "pos_servings": mock["pos_servings"],
            "variance_detected": variance_detected,
            "confidence": mock["fill_confidence"],
            "recommendation": "Perform a manual bottle count and review pour controls during peak periods." if variance_detected else "No significant variance detected."
        },
        "financials": {
            "cost_per_bottle": bottle["cost"],
            "price_per_serving": bottle["price"],
            "remaining_revenue_value": round(vision_servings * bottle["price"], 2),
            "variance_revenue_impact": round(abs(vision_servings - mock["inv_servings"]) * bottle["price"], 2) if variance_detected else 0
        }
    }


@router.post("/vision/analyze")
async def analyze_bottle(image: Optional[UploadFile] = File(None)):
    """Analyze a single bottle image. If no file uploaded, returns Don Julio 1942 demo."""
    # Determine which bottle to "recognize" based on filename
    bottle_key = "don-julio-1942"  # default

    if image and image.filename:
        fname = image.filename.lower()
        for key in BOTTLE_DATABASE:
            # Match by product name in filename
            name_parts = BOTTLE_DATABASE[key]["name"].lower().replace("'", "").split()
            if any(part in fname for part in name_parts):
                bottle_key = key
                break

    result = _analyze_single_bottle(bottle_key, image.filename if image else "demo_bottle.jpg")
    return result


@router.post("/vision/analyze-batch")
async def analyze_batch(images: List[UploadFile] = File(...)):
    """
    Analyze multiple bottle images at once.
    Upload multiple files — each is analyzed independently.
    Returns a list of results with summary statistics.
    """
    results = []
    bottle_keys = list(BOTTLE_DATABASE.keys())

    for i, image in enumerate(images):
        # Try to match filename to a known bottle
        bottle_key = None
        if image.filename:
            fname = image.filename.lower()
            for key in BOTTLE_DATABASE:
                name_parts = BOTTLE_DATABASE[key]["name"].lower().replace("'", "").split()
                if any(part in fname for part in name_parts):
                    bottle_key = key
                    break

        # If not matched, cycle through bottles for demo variety
        if not bottle_key:
            bottle_key = bottle_keys[i % len(bottle_keys)]

        result = _analyze_single_bottle(bottle_key, image.filename or f"bottle_{i+1}.jpg")
        results.append(result)

    # Summary statistics
    total_variance_count = sum(1 for r in results if r["comparison"]["variance_detected"])
    total_variance_value = sum(r["financials"]["variance_revenue_impact"] for r in results)
    total_remaining_value = sum(r["financials"]["remaining_revenue_value"] for r in results)

    return {
        "total_bottles_analyzed": len(results),
        "variance_detected_count": total_variance_count,
        "total_variance_revenue_impact": round(total_variance_value, 2),
        "total_remaining_revenue_value": round(total_remaining_value, 2),
        "results": results,
        "summary": {
            "bottles_ok": len(results) - total_variance_count,
            "bottles_with_variance": total_variance_count,
            "recommendation": f"{total_variance_count} bottle(s) show potential variance. Recommend manual count for flagged items." if total_variance_count > 0 else "All bottles within expected parameters."
        }
    }


@router.get("/vision/bottles")
async def list_known_bottles():
    """List all bottles the vision system can recognize (for demo purposes)."""
    return {
        "bottles": [
            {"id": k, "name": v["name"], "size_ml": v["bottle_size_ml"], "pour_ml": v["standard_pour_ml"]}
            for k, v in BOTTLE_DATABASE.items()
        ],
        "tip": "Upload images with bottle names in the filename for best demo results (e.g., 'don-julio-photo.jpg', 'grey-goose-bar.png')"
    }
