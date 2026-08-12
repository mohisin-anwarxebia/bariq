from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid


def gen_id():
    return str(uuid.uuid4())[:8]


class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    locations = relationship("Location", back_populates="organization")


class Location(Base):
    __tablename__ = "locations"
    id = Column(String, primary_key=True, default=gen_id)
    organization_id = Column(String, ForeignKey("organizations.id"))
    name = Column(String, nullable=False)
    address = Column(String)
    organization = relationship("Organization", back_populates="locations")


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    email = Column(String)
    role = Column(String)
    organization_id = Column(String, ForeignKey("organizations.id"))


class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    category = Column(String)  # beverage, food, cocktail
    subcategory = Column(String)  # tequila, vodka, whiskey, beer, wine, appetizer, entree
    unit = Column(String)  # bottle, lb, each
    bottle_size_ml = Column(Integer, nullable=True)
    standard_pour_ml = Column(Integer, nullable=True)
    cost = Column(Float)
    price = Column(Float)
    organization_id = Column(String, ForeignKey("organizations.id"))


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(String, primary_key=True, default=gen_id)
    product_id = Column(String, ForeignKey("products.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    theoretical_qty = Column(Float)
    actual_qty = Column(Float)
    unit = Column(String)
    last_counted = Column(DateTime, default=datetime.utcnow)
    product = relationship("Product")
    location = relationship("Location")


class SalesTransaction(Base):
    __tablename__ = "sales_transactions"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"))
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer)
    revenue = Column(Float)
    cost = Column(Float)
    discount = Column(Float, default=0)
    date = Column(DateTime)
    product = relationship("Product")
    location = relationship("Location")


class WasteRecord(Base):
    __tablename__ = "waste_records"
    id = Column(String, primary_key=True, default=gen_id)
    product_id = Column(String, ForeignKey("products.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    quantity = Column(Float)
    value = Column(Float)
    reason = Column(String)
    date = Column(DateTime)


class CustomerExperience(Base):
    __tablename__ = "customer_experiences"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"))
    customer_name = Column(String)
    food_rating = Column(String)  # excellent, good, needs_improvement
    beverage_rating = Column(String)
    service_rating = Column(String)
    wait_rating = Column(String)  # better, expected, worse
    comment = Column(Text, nullable=True)
    products_ordered = Column(Text)  # JSON list
    verified = Column(Boolean, default=True)
    date = Column(DateTime, default=datetime.utcnow)
    location = relationship("Location")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"))
    date = Column(DateTime)
    temperature_f = Column(Integer)
    condition = Column(String)
    rain_probability = Column(Integer)


class LocalEvent(Base):
    __tablename__ = "local_events"
    id = Column(String, primary_key=True, default=gen_id)
    location_id = Column(String, ForeignKey("locations.id"))
    name = Column(String)
    date = Column(DateTime)
    expected_attendance = Column(Integer)
    distance_miles = Column(Float)
    category = Column(String)


class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(String, primary_key=True, default=gen_id)
    title = Column(String)
    description = Column(Text)
    category = Column(String)  # inventory, staffing, menu, operations
    impact_value = Column(Float)
    confidence = Column(Float)
    status = Column(String, default="pending")  # pending, approved, rejected
    location_id = Column(String, ForeignKey("locations.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(String, primary_key=True, default=gen_id)
    po_number = Column(String)
    product_id = Column(String, ForeignKey("products.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    quantity = Column(Float)
    unit = Column(String)
    total_cost = Column(Float)
    status = Column(String, default="created")
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String)
    product = relationship("Product")


class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(String, primary_key=True, default=gen_id)
    user_name = Column(String)
    action = Column(String)
    details = Column(Text)
    context = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)


class AgentConversation(Base):
    __tablename__ = "agent_conversations"
    id = Column(String, primary_key=True, default=gen_id)
    user_id = Column(String)
    messages = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
