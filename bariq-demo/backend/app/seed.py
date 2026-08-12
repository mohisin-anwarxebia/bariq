"""Seed the demo database with realistic data."""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import (
    Organization, Location, User, Product, InventoryItem,
    SalesTransaction, WasteRecord, CustomerExperience,
    WeatherObservation, LocalEvent, Recommendation
)
import random
import json

random.seed(42)


def seed_database(db: Session):
    # Check if already seeded
    if db.query(Organization).first():
        return

    # Organization
    org = Organization(id="urbanpour", name="Urban Pour Hospitality")
    db.add(org)

    # Locations
    locations = [
        Location(id="downtown", organization_id="urbanpour", name="Downtown Social", address="123 Main St, Austin TX"),
        Location(id="midtown", organization_id="urbanpour", name="Midtown Social", address="456 Oak Ave, Austin TX"),
        Location(id="airport", organization_id="urbanpour", name="Airport Social", address="789 Terminal Blvd, Austin TX"),
    ]
    for loc in locations:
        db.add(loc)

    # Users
    users = [
        User(id="alex", name="Alex Morgan", email="alex@urbanpour.com", role="regional_manager", organization_id="urbanpour"),
        User(id="sam", name="Sam Chen", email="sam@urbanpour.com", role="bar_manager", organization_id="urbanpour"),
        User(id="jordan", name="Jordan Rivera", email="jordan@urbanpour.com", role="inventory_manager", organization_id="urbanpour"),
    ]
    for u in users:
        db.add(u)

    # Products
    products_data = [
        # Spirits
        ("don-julio-1942", "Don Julio 1942", "beverage", "tequila", "bottle", 750, 30, 145.00, 22.00),
        ("patron-silver", "Patron Silver", "beverage", "tequila", "bottle", 750, 30, 48.00, 14.00),
        ("titos-vodka", "Tito's Vodka", "beverage", "vodka", "bottle", 750, 45, 22.00, 11.00),
        ("grey-goose", "Grey Goose", "beverage", "vodka", "bottle", 750, 45, 35.00, 14.00),
        ("jameson", "Jameson", "beverage", "whiskey", "bottle", 750, 45, 28.00, 12.00),
        ("woodford-reserve", "Woodford Reserve", "beverage", "whiskey", "bottle", 750, 45, 38.00, 14.00),
        ("jack-daniels", "Jack Daniel's", "beverage", "whiskey", "bottle", 750, 45, 24.00, 10.00),
        ("hendricks-gin", "Hendrick's Gin", "beverage", "gin", "bottle", 750, 45, 36.00, 14.00),
        ("tanqueray", "Tanqueray", "beverage", "gin", "bottle", 750, 45, 26.00, 12.00),
        ("bacardi", "Bacardi", "beverage", "rum", "bottle", 750, 45, 18.00, 10.00),
        # Beer
        ("modelo", "Modelo", "beverage", "beer", "each", None, None, 2.50, 7.00),
        ("corona", "Corona", "beverage", "beer", "each", None, None, 2.50, 7.00),
        ("guinness", "Guinness", "beverage", "beer", "each", None, None, 3.00, 8.00),
        # Wine
        ("house-cabernet", "House Cabernet", "beverage", "wine", "bottle", 750, 150, 12.00, 12.00),
        ("house-chardonnay", "House Chardonnay", "beverage", "wine", "bottle", 750, 150, 11.00, 12.00),
        # Cocktails
        ("margarita", "Margarita", "cocktail", "cocktail", "each", None, None, 4.50, 14.00),
        ("old-fashioned", "Old Fashioned", "cocktail", "cocktail", "each", None, None, 5.00, 15.00),
        ("mojito", "Mojito", "cocktail", "cocktail", "each", None, None, 4.00, 13.00),
        ("espresso-martini", "Espresso Martini", "cocktail", "cocktail", "each", None, None, 5.50, 16.00),
        ("moscow-mule", "Moscow Mule", "cocktail", "cocktail", "each", None, None, 4.00, 13.00),
        # Food
        ("chicken-wings", "Chicken Wings", "food", "appetizer", "each", None, None, 4.80, 16.00),
        ("smash-burger", "Smash Burger", "food", "entree", "each", None, None, 5.20, 18.00),
        ("steak-frites", "Steak Frites", "food", "entree", "each", None, None, 12.00, 34.00),
        ("caesar-salad", "Caesar Salad", "food", "appetizer", "each", None, None, 3.50, 14.00),
        ("fish-tacos", "Fish Tacos", "food", "entree", "each", None, None, 5.80, 17.00),
        ("truffle-fries", "Truffle Fries", "food", "appetizer", "each", None, None, 3.20, 12.00),
        ("nachos", "Nachos", "food", "appetizer", "each", None, None, 4.00, 14.00),
        ("chicken-sandwich", "Chicken Sandwich", "food", "entree", "each", None, None, 4.50, 15.00),
        ("cheesecake", "Cheesecake", "food", "dessert", "each", None, None, 3.80, 12.00),
    ]

    products = []
    for pid, name, cat, subcat, unit, bottle, pour, cost, price in products_data:
        p = Product(
            id=pid, name=name, category=cat, subcategory=subcat,
            unit=unit, bottle_size_ml=bottle, standard_pour_ml=pour,
            cost=cost, price=price, organization_id="urbanpour"
        )
        db.add(p)
        products.append(p)

    # Inventory - create intentional variances
    inventory_data = [
        ("don-julio-1942", "downtown", 18.0, 16.3),  # RED variance
        ("don-julio-1942", "midtown", 12.0, 11.8),
        ("don-julio-1942", "airport", 8.0, 7.5),
        ("patron-silver", "downtown", 22.0, 21.5),
        ("patron-silver", "midtown", 15.0, 14.8),
        ("titos-vodka", "downtown", 28.0, 27.6),
        ("titos-vodka", "midtown", 20.0, 19.8),
        ("grey-goose", "downtown", 15.0, 14.7),
        ("jameson", "downtown", 18.0, 17.5),
        ("woodford-reserve", "downtown", 12.0, 11.8),
        ("jack-daniels", "downtown", 24.0, 23.5),
        ("hendricks-gin", "downtown", 10.0, 9.8),
        ("tanqueray", "downtown", 14.0, 13.8),
        ("bacardi", "downtown", 16.0, 15.7),
        ("modelo", "downtown", 240.0, 235.0),
        ("corona", "downtown", 200.0, 198.0),
        ("guinness", "downtown", 120.0, 118.0),
        ("house-cabernet", "downtown", 24.0, 23.5),
        ("house-chardonnay", "downtown", 20.0, 19.5),
        ("chicken-wings", "downtown", 110.0, 85.0),  # YELLOW - stock risk
    ]

    for prod_id, loc_id, theoretical, actual in inventory_data:
        inv = InventoryItem(
            product_id=prod_id, location_id=loc_id,
            theoretical_qty=theoretical, actual_qty=actual, unit="units"
        )
        db.add(inv)

    # Generate 30 days of sales
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    location_ids = ["downtown", "midtown", "airport"]
    beverage_ids = [p[0] for p in products_data if p[2] in ("beverage", "cocktail")]
    food_ids = [p[0] for p in products_data if p[2] == "food"]
    product_map = {p[0]: p for p in products_data}

    for day_offset in range(30, 0, -1):
        date = today - timedelta(days=day_offset)
        day_of_week = date.weekday()
        # Higher volume on Friday(4) and Saturday(5)
        if day_of_week == 5:
            multiplier = 1.8
        elif day_of_week == 4:
            multiplier = 1.5
        elif day_of_week == 0:
            multiplier = 0.7
        else:
            multiplier = 1.0

        for loc_id in location_ids:
            loc_multiplier = 1.2 if loc_id == "downtown" else (0.9 if loc_id == "airport" else 1.0)
            # Beverage sales
            for prod_id in beverage_ids:
                qty = max(1, int(random.gauss(8, 3) * multiplier * loc_multiplier))
                p = product_map[prod_id]
                sale = SalesTransaction(
                    location_id=loc_id, product_id=prod_id,
                    quantity=qty, revenue=round(qty * p[8], 2),
                    cost=round(qty * p[7], 2), discount=0,
                    date=date
                )
                db.add(sale)

            # Food sales
            for prod_id in food_ids:
                qty = max(1, int(random.gauss(12, 4) * multiplier * loc_multiplier))
                p = product_map[prod_id]
                sale = SalesTransaction(
                    location_id=loc_id, product_id=prod_id,
                    quantity=qty, revenue=round(qty * p[8], 2),
                    cost=round(qty * p[7], 2), discount=0,
                    date=date
                )
                db.add(sale)

    # Waste records
    waste_data = [
        ("chicken-wings", "downtown", 8, 38.40, "Overcooked"),
        ("chicken-wings", "downtown", 5, 24.00, "Expired"),
        ("chicken-wings", "midtown", 3, 14.40, "Dropped"),
        ("caesar-salad", "downtown", 4, 14.00, "Wilted"),
        ("don-julio-1942", "downtown", 0.3, 43.50, "Broken bottle"),
    ]
    for prod_id, loc_id, qty, val, reason in waste_data:
        db.add(WasteRecord(
            product_id=prod_id, location_id=loc_id,
            quantity=qty, value=val, reason=reason,
            date=today - timedelta(days=random.randint(1, 7))
        ))

    # Customer Experience
    experiences = [
        ("downtown", "Customer #1042", "good", "needs_improvement", "good", "worse",
         '["Margarita","Chicken Wings","Truffle Fries"]', "Drink took too long"),
        ("downtown", "Customer #1087", "excellent", "excellent", "excellent", "expected",
         '["Old Fashioned","Steak Frites"]', None),
        ("downtown", "Customer #1103", "good", "needs_improvement", "good", "worse",
         '["Espresso Martini","Nachos"]', "Cocktail was weak"),
        ("midtown", "Customer #2055", "excellent", "good", "excellent", "better",
         '["Moscow Mule","Fish Tacos"]', None),
        ("midtown", "Customer #2061", "good", "good", "needs_improvement", "worse",
         '["Modelo","Smash Burger"]', "Service was slow"),
        ("airport", "Customer #3022", "good", "good", "good", "expected",
         '["Guinness","Caesar Salad"]', None),
        ("downtown", "Customer #1120", "needs_improvement", "good", "good", "worse",
         '["Chicken Wings","Truffle Fries"]', "Wings were dry"),
        ("downtown", "Customer #1134", "good", "needs_improvement", "good", "worse",
         '["Margarita","Mojito"]', "Inconsistent drinks"),
        ("downtown", "Customer #1145", "excellent", "good", "excellent", "expected",
         '["Woodford Reserve","Cheesecake"]', None),
        ("midtown", "Customer #2078", "good", "excellent", "good", "expected",
         '["Grey Goose","Nachos"]', None),
    ]
    for loc, cust, food, bev, svc, wait, prods, comment in experiences:
        db.add(CustomerExperience(
            location_id=loc, customer_name=cust,
            food_rating=food, beverage_rating=bev,
            service_rating=svc, wait_rating=wait,
            products_ordered=prods, comment=comment,
            verified=True, date=today - timedelta(days=random.randint(0, 14))
        ))

    # Weather
    for i in range(7):
        date = today + timedelta(days=i)
        for loc_id in location_ids:
            temp = random.randint(88, 96) if i < 3 else random.randint(82, 90)
            db.add(WeatherObservation(
                location_id=loc_id, date=date,
                temperature_f=temp, condition="Sunny" if temp > 90 else "Partly Cloudy",
                rain_probability=10 if temp > 90 else 30
            ))

    # Local Events
    saturday = today + timedelta(days=(5 - today.weekday()) % 7)
    db.add(LocalEvent(
        location_id="downtown", name="Downtown Summer Music Festival",
        date=saturday, expected_attendance=20000,
        distance_miles=1.2, category="music"
    ))
    db.add(LocalEvent(
        location_id="midtown", name="Midtown Food Truck Rally",
        date=saturday + timedelta(days=1), expected_attendance=5000,
        distance_miles=0.5, category="food"
    ))

    # Recommendations
    recommendations = [
        ("Order tequila inventory", "Based on Saturday demand forecast (+27%) and current inventory levels, recommend ordering 4 cases of tequila to prevent stock-out.", "inventory", 3240.0, 0.91, "downtown"),
        ("Review Friday bar staffing", "Customer wait time satisfaction declined 9% on Fridays. Peak demand between 8-10 PM exceeds current throughput capacity.", "staffing", 1800.0, 0.83, "downtown"),
        ("Review Don Julio pour controls", "Unexplained inventory variance of 1.7 bottles detected. Estimated impact $425. Review pour controls during peak periods.", "operations", 425.0, 0.84, "downtown"),
        ("Increase chicken wing prep", "Saturday demand forecast +21% combined with current stock risk. Order additional 180 lbs chicken.", "inventory", 2160.0, 0.87, "downtown"),
    ]
    for title, desc, cat, impact, conf, loc in recommendations:
        db.add(Recommendation(
            title=title, description=desc, category=cat,
            impact_value=impact, confidence=conf,
            location_id=loc, status="pending"
        ))

    db.commit()
