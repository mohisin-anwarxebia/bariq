from fastapi import APIRouter, UploadFile, File
from typing import Optional
import random

router = APIRouter()

# Mock bottle database for demo
BOTTLE_DATABASE = {
    "don-julio-1942": {
        "name": "Don Julio 1942", "product_id": "don-julio-1942",
        "bottle_size_ml": 750, "standard_pour_ml": 30, "cost": 145.00, "price": 22.00,
    },
    "patron-silver": {
        "name": "Patron Silver", "product_id": "patron-silver",
        "bottle_size_ml": 750, "standard_pour_ml": 30, "cost": 48.00, "price": 14.00,
    },
    "titos-vodka": {
        "name": "Tito's Vodka", "product_id": "titos-vodka",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 22.00, "price": 11.00,
    },
    "grey-goose": {
        "name": "Grey Goose", "product_id": "grey-goose",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 35.00, "price": 14.00,
    },
    "jameson": {
        "name": "Jameson", "product_id": "jameson",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 28.00, "price": 12.00,
    },
    "woodford-reserve": {
        "name": "Woodford Reserve", "product_id": "woodford-reserve",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 38.00, "price": 14.00,
    },
    "hendricks-gin": {
        "name": "Hendrick's Gin", "product_id": "hendricks-gin",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 36.00, "price": 14.00,
    },
    "jack-daniels": {
        "name": "Jack Daniel's", "product_id": "jack-daniels",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 24.00, "price": 10.00,
    },
    "tanqueray": {
        "name": "Tanqueray", "product_id": "tanqueray",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 26.00, "price": 12.00,
    },
    "bacardi": {
        "name": "Bacardi", "product_id": "bacardi",
        "bottle_size_ml": 750, "standard_pour_ml": 45, "cost": 18.00, "price": 10.00,
    },
}

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


def _match_bottle_from_filename(filename: str) -> Optional[str]:
    """Try to match a bottle from the filename."""
    fname = filename.lower()
    for key in BOTTLE_DATABASE:
        name_parts = BOTTLE_DATABASE[key]["name"].lower().replace("'", "").split()
        if any(part in fname for part in name_parts if len(part) > 3):
            return key
    return None


def _analyze_single_bottle(bottle_key: str) -> dict:
    """Generate analysis for a single bottle."""
    bottle = BOTTLE_DATABASE[bottle_key]
    mock = MOCK_ANALYSIS[bottle_key]

    fill_pct = mock["fill_pct"]
    remaining_ml = int(bottle["bottle_size_ml"] * fill_pct / 100)
    vision_servings = int(remaining_ml / bottle["standard_pour_ml"])
    variance_detected = vision_servings != mock["inv_servings"]

    return {
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


def _detect_bottles_in_image(filename: str) -> list:
    """
    Simulate detecting multiple bottles in a single image.
    In production, this would use a real object detection model (YOLO, etc.)
    that identifies and localizes each bottle in the frame.

    For demo: uses filename hints or returns a random set of 1-4 bottles.
    """
    matched = _match_bottle_from_filename(filename) if filename else None

    if matched:
        # If filename matches one specific bottle, return just that one
        return [matched]

    # Simulate detecting multiple bottles in a shelf/bar photo
    # Keywords that suggest multi-bottle images
    multi_keywords = ["shelf", "bar", "rack", "lineup", "collection", "all", "multiple", "batch", "inventory", "stock"]
    if filename and any(kw in filename.lower() for kw in multi_keywords):
        # Simulate detecting 3-5 bottles in a shelf image
        count = random.randint(3, 5)
        keys = list(BOTTLE_DATABASE.keys())
        random.shuffle(keys)
        return keys[:count]

    # Default: detect 1 bottle (Don Julio for demo)
    return ["don-julio-1942"]


@router.post("/vision/analyze")
async def analyze_image(image: Optional[UploadFile] = File(None)):
    """
    Analyze a single image that may contain one or multiple bottles.

    The vision system:
    1. Scans the image for bottle objects
    2. Identifies each bottle (brand recognition)
    3. Estimates fill level for each
    4. Compares against inventory and POS for each

    If only one bottle is detected, returns single-bottle detail.
    If multiple bottles are detected, returns batch summary + per-bottle detail.

    Tip: Use filenames like 'shelf-photo.jpg' or 'bar-lineup.png' to simulate
    multi-bottle detection in demo mode.
    """
    filename = image.filename if image else "demo_bottle.jpg"

    # Step 1: Detect how many bottles are in the image
    detected_bottles = _detect_bottles_in_image(filename)
    bottles_count = len(detected_bottles)

    # Step 2: Analyze each detected bottle
    results = []
    for i, bottle_key in enumerate(detected_bottles):
        analysis = _analyze_single_bottle(bottle_key)
        analysis["detection"] = {
            "index": i + 1,
            "location": _mock_bounding_box(i, bottles_count),
            "detection_confidence": round(random.uniform(0.88, 0.97), 2)
        }
        results.append(analysis)

    # Step 3: Return appropriate response format
    if bottles_count == 1:
        # Single bottle — flat response for backward compatibility
        result = results[0]
        result["bottles_detected"] = 1
        result["filename"] = filename
        return result
    else:
        # Multiple bottles detected in one image
        total_variance_count = sum(1 for r in results if r["comparison"]["variance_detected"])
        total_variance_value = sum(r["financials"]["variance_revenue_impact"] for r in results)
        total_remaining_value = sum(r["financials"]["remaining_revenue_value"] for r in results)

        return {
            "filename": filename,
            "bottles_detected": bottles_count,
            "scan_type": "multi_bottle",
            "detection_summary": {
                "total_detected": bottles_count,
                "bottles_ok": bottles_count - total_variance_count,
                "bottles_with_variance": total_variance_count,
                "total_variance_revenue_impact": round(total_variance_value, 2),
                "total_remaining_revenue_value": round(total_remaining_value, 2),
                "recommendation": f"{total_variance_count} of {bottles_count} bottles show potential variance. Recommend manual count for flagged items." if total_variance_count > 0 else "All detected bottles within expected parameters."
            },
            "bottles": results
        }


@router.get("/vision/bottles")
async def list_known_bottles():
    """List all bottles the vision system can recognize."""
    return {
        "bottles": [
            {"id": k, "name": v["name"], "size_ml": v["bottle_size_ml"], "pour_ml": v["standard_pour_ml"]}
            for k, v in BOTTLE_DATABASE.items()
        ],
        "tips": [
            "Upload any image — the system detects bottles automatically",
            "Single bottle in frame → detailed single-bottle analysis",
            "Multiple bottles in frame → batch analysis with summary",
            "Use 'shelf', 'bar', 'rack', 'lineup' in filename to simulate multi-bottle detection",
            "Use bottle names in filename for specific recognition (e.g., 'grey-goose.jpg')"
        ]
    }


def _mock_bounding_box(index: int, total: int) -> dict:
    """Generate a mock bounding box position for detected bottle in image."""
    width_per = 1.0 / total
    return {
        "x": round(index * width_per + 0.02, 2),
        "y": 0.1,
        "width": round(width_per - 0.04, 2),
        "height": 0.8
    }
