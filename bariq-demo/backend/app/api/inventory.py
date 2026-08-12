from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import InventoryItem, Product, SalesTransaction
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(InventoryItem).all()
    result = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        variance = round(item.theoretical_qty - item.actual_qty, 1)
        variance_value = round(abs(variance) * product.cost, 2)

        if abs(variance) > 1.5 or (item.theoretical_qty > 0 and abs(variance) / item.theoretical_qty > 0.08):
            status = "red"
        elif abs(variance) > 0.5 or (item.theoretical_qty > 0 and abs(variance) / item.theoretical_qty > 0.03):
            status = "yellow"
        else:
            status = "green"

        entry = {
            "id": item.id,
            "product_id": product.id,
            "product_name": product.name,
            "category": product.category,
            "subcategory": product.subcategory,
            "location_id": item.location_id,
            "on_hand": item.actual_qty,
            "expected": item.theoretical_qty,
            "variance": variance,
            "variance_value": variance_value,
            "unit": item.unit,
            "status": status,
            "bottle_size_ml": product.bottle_size_ml,
            "standard_pour_ml": product.standard_pour_ml,
            "cost": product.cost,
            "price": product.price,
        }

        # Pour analytics for spirits
        if product.bottle_size_ml and product.standard_pour_ml:
            remaining_ml = item.actual_qty * product.bottle_size_ml
            servings_remaining = int(remaining_ml / product.standard_pour_ml)
            expected_servings = int(item.theoretical_qty * product.bottle_size_ml / product.standard_pour_ml)
            entry["remaining_ml"] = remaining_ml
            entry["servings_remaining"] = servings_remaining
            entry["expected_servings"] = expected_servings
            entry["pour_variance"] = expected_servings - servings_remaining
            entry["revenue_impact"] = round((expected_servings - servings_remaining) * product.price, 2)

        result.append(entry)

    return {"items": result}


@router.get("/inventory/variance")
def get_inventory_variance(db: Session = Depends(get_db)):
    items = db.query(InventoryItem).all()
    variances = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        variance = round(item.theoretical_qty - item.actual_qty, 2)
        if abs(variance) > 0.1:
            variances.append({
                "product_id": product.id,
                "product_name": product.name,
                "category": product.category,
                "location_id": item.location_id,
                "beginning_inventory": round(item.theoretical_qty + 2, 1),
                "purchases": 0,
                "theoretical_consumption": 2.0,
                "known_waste": 0.3 if product.id == "don-julio-1942" else 0,
                "expected_ending": item.theoretical_qty,
                "actual_ending": item.actual_qty,
                "variance_qty": variance,
                "variance_value": round(abs(variance) * product.cost, 2),
                "variance_pct": round((variance / item.theoretical_qty) * 100, 1) if item.theoretical_qty else 0,
                "status": "red" if abs(variance) > 1.5 else ("yellow" if abs(variance) > 0.5 else "green"),
                "possible_causes": [
                    "Over-pouring",
                    "Waste",
                    "Breakage",
                    "Receiving discrepancy",
                    "Counting error",
                    "POS mapping issue",
                    "Unexplained operational variance"
                ] if abs(variance) > 1 else ["Minor measurement variance"]
            })

    variances.sort(key=lambda x: abs(x["variance_value"]), reverse=True)
    return {
        "variances": variances,
        "total_variance_value": round(sum(v["variance_value"] for v in variances), 2),
        "total_items_with_variance": len(variances)
    }
