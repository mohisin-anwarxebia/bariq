from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, List
from app.database import get_db
from app.models import AuditEvent, Recommendation, PurchaseOrder
from datetime import datetime

router = APIRouter()


class AgentMessage(BaseModel):
    message: str
    context: Optional[Dict] = {}


MOCK_RESPONSES = {
    "tequila": {
        "answer": "Don Julio 1942 shows a potential inventory variance at Downtown Social.",
        "evidence": [
            "Expected inventory: 18 bottles",
            "Vision estimate: 16.3 bottles",
            "POS/theoretical consumption: 17 bottles",
            "Potential unexplained variance: approximately 1.7 bottles"
        ],
        "impact": "Estimated value: $425",
        "recommendation": "Perform a manual bottle count and review pour controls during peak periods.",
        "confidence": 0.84,
        "actions": [
            {"id": "investigate-variance", "label": "Investigate Variance", "type": "navigate"},
            {"id": "schedule-count", "label": "Schedule Count", "type": "action"}
        ]
    },
    "order": {
        "answer": "Based on Saturday's demand forecast and current inventory levels, I recommend the following orders:",
        "evidence": [
            "Saturday beverage demand forecast: +24%",
            "Downtown Summer Music Festival: 20,000 attendees",
            "Temperature: 94°F (historically increases beverage demand)",
            "Current tequila stock: 16.3 bottles (below safety stock)",
            "Current chicken stock: 85 lbs (below forecast demand)"
        ],
        "impact": "Total opportunity/risk avoidance: $5,400",
        "recommendation": "Order 4 cases tequila ($1,920), 180 lbs chicken ($540), 12 cases beer ($360).",
        "confidence": 0.91,
        "actions": [
            {"id": "create-po-tequila", "label": "Order 4 Cases Tequila", "type": "approve", "amount": 1920},
            {"id": "create-po-chicken", "label": "Order 180 lbs Chicken", "type": "approve", "amount": 540},
            {"id": "create-po-beer", "label": "Order 12 Cases Beer", "type": "approve", "amount": 360}
        ]
    },
    "revenue": {
        "answer": "Weekly revenue is $82,430, up 8.2% from last week. Beverage revenue is outperforming food.",
        "evidence": [
            "Total revenue: $82,430 (+8.2%)",
            "Beverage revenue: $46,280 (+11.4%)",
            "Food revenue: $36,150 (+4.1%)",
            "Gross margin: 68.4% (-2.3% due to increased COGS)"
        ],
        "impact": "Margin decline represents approximately $1,900 in lost profit this week",
        "recommendation": "Review food costs (chicken wings waste up 14%) and beverage pour controls.",
        "confidence": 0.89,
        "actions": []
    },
    "customer": {
        "answer": "Customer experience score is 87/100. Beverage satisfaction has declined, particularly on Friday/Saturday evenings.",
        "evidence": [
            "Overall experience: 87/100",
            "Food: 91/100",
            "Beverage: 72/100 (declined 9%)",
            "Service: 78/100",
            "Wait time: 72/100",
            "Largest decline: Friday/Saturday 8-10 PM",
            "Correlated with +22% order volume and +14% wait time"
        ],
        "impact": "Potential revenue at risk from declining experience: ~$2,400/week",
        "recommendation": "Review Friday/Saturday bar staffing and consider adding a barback during peak hours.",
        "confidence": 0.78,
        "actions": [
            {"id": "review-staffing", "label": "Review Staffing Plan", "type": "navigate"}
        ]
    },
    "saturday": {
        "answer": "Saturday is expected to see significantly increased demand due to a downtown music festival and hot weather.",
        "evidence": [
            "Downtown Summer Music Festival: 20,000 expected attendees, 1.2 miles away",
            "Weather: 94°F, Sunny, 10% rain probability",
            "Historical Saturday pattern: +15% baseline",
            "Combined forecast: Beer +18%, Cocktails +24%, Tequila +27%, Chicken Wings +21%"
        ],
        "impact": "Estimated additional revenue opportunity: $8,200",
        "recommendation": "Ensure adequate inventory, consider extended hours, and add staff for peak demand.",
        "confidence": 0.86,
        "actions": [
            {"id": "view-forecast", "label": "View Full Forecast", "type": "navigate"},
            {"id": "create-po-tequila", "label": "Order Tequila", "type": "approve", "amount": 1920}
        ]
    },
    "location": {
        "answer": "Downtown Social is the top performer, followed by Midtown Social and Airport Social.",
        "evidence": [
            "Downtown Social: $38,400 revenue (46.6% of total), highest traffic",
            "Midtown Social: $27,200 revenue (33.0% of total), steady growth",
            "Airport Social: $16,830 revenue (20.4% of total), consistent margins"
        ],
        "impact": "Downtown drives nearly half of total revenue but also has highest variance",
        "recommendation": "Focus operational improvements on Downtown Social for maximum impact.",
        "confidence": 0.92,
        "actions": []
    },
    "improve": {
        "answer": "This week's top improvement opportunities based on data analysis:",
        "evidence": [
            "1. Tequila inventory variance: $425 potential loss",
            "2. Friday/Saturday bar throughput: 9% experience decline",
            "3. Chicken wings waste: $420 this week (+14%)",
            "4. Saturday demand preparation: $8,200 revenue opportunity"
        ],
        "impact": "Combined opportunity: approximately $11,000 in revenue protection and growth",
        "recommendation": "Priority: (1) Order for Saturday demand, (2) Address pour controls, (3) Review Friday staffing.",
        "confidence": 0.85,
        "actions": [
            {"id": "view-recommendations", "label": "View All Recommendations", "type": "navigate"}
        ]
    }
}


def get_mock_response(message: str, context: dict) -> dict:
    msg_lower = message.lower()

    # Context-aware: if on inventory page looking at a product
    if context.get("entityId") == "don-julio-1942" or "this" in msg_lower:
        if context.get("screen") == "inventory":
            return MOCK_RESPONSES["tequila"]

    # Keyword matching
    for keyword, response in MOCK_RESPONSES.items():
        if keyword in msg_lower:
            return response

    # Check for common phrases
    if any(w in msg_lower for w in ["profit", "money", "revenue", "sales"]):
        return MOCK_RESPONSES["revenue"]
    if any(w in msg_lower for w in ["complain", "feedback", "experience", "satisfaction"]):
        return MOCK_RESPONSES["customer"]
    if any(w in msg_lower for w in ["prepare", "weekend", "forecast"]):
        return MOCK_RESPONSES["saturday"]
    if any(w in msg_lower for w in ["best", "worst", "compare", "location"]):
        return MOCK_RESPONSES["location"]
    if any(w in msg_lower for w in ["improve", "better", "optimize", "week"]):
        return MOCK_RESPONSES["improve"]

    # Default
    return {
        "answer": "I can help you with revenue analysis, inventory management, customer experience, demand forecasting, and operational recommendations. What would you like to know?",
        "evidence": [],
        "recommendation": "Try asking about inventory variance, Saturday forecast, customer feedback, or what you should order.",
        "confidence": 1.0,
        "actions": []
    }


@router.post("/agent/message")
def agent_message(req: AgentMessage, db: Session = Depends(get_db)):
    response = get_mock_response(req.message, req.context or {})

    # Log audit
    db.add(AuditEvent(
        user_name="Alex Morgan",
        action="agent_query",
        details=f"Q: {req.message} | A: {response['answer'][:100]}",
        context=str(req.context)
    ))
    db.commit()

    return response
