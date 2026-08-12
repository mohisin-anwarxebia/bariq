# BARIQ — Beverage Analytics & Revenue Intelligence Quad

**Embedded Agentic AI Intelligence Layer for Hospitality**

BARIQ is not a standalone application. It is an embedded intelligence layer that sits inside existing hospitality software, connecting POS, inventory, food, beverage, computer vision, customer experience, weather, events, and forecasting into a unified intelligence platform.

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
docker compose up --build
```

Then open:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Demo Credentials

| User | Role |
|------|------|
| Alex Morgan | Regional Manager |

No login required for the demo — the application starts as Alex Morgan.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  "Urban Pour Operations"  (Fictional Host Application)  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  BARIQ Intelligence Layer (Embedded)              │ │
│  │                                                    │ │
│  │  • Revenue Intelligence                           │ │
│  │  • Inventory Reconciliation                       │ │
│  │  • Beverage Pour Analytics                        │ │
│  │  • Computer Vision Bottle Analysis                │ │
│  │  • Customer Experience Engine                     │ │
│  │  • Demand Forecasting                             │ │
│  │  • Weather/Event Intelligence                     │ │
│  │  • Conversational AI Agent                        │ │
│  │  • Recommendation/Action Engine                   │ │
│  │  • Audit Trail                                    │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite (demo) |
| AI | MockAIProvider (works without API key) |
| Vision | MockVisionProvider |

---

## Demo Walkthrough

1. **Open Dashboard** — See revenue KPIs and BARIQ alerts
2. **Click Inventory** — View inventory with variance detection (Don Julio 1942 = RED)
3. **Click Vision** — Analyze a demo bottle, see fill level (65%), servings (16)
4. **Vision Reconciliation** — Compare Vision vs Inventory vs POS servings
5. **Click Experience** — Verified customer feedback with root-cause analysis
6. **Click Forecast** — Saturday demand forecast (+24% beverages) with weather/event factors
7. **Click Ask BARIQ** — Conversational agent: ask "Why is tequila variance high?"
8. **Agent recommends** — "Order 4 cases tequila" → Click Approve
9. **Click Actions** — View and approve recommendations, creates Purchase Orders
10. **Click Audit** — Complete decision history

---

## Key Demo Scenarios

### Scenario 1: Customer Feedback → Operational Action
```
Customer: "Drinks are inconsistent"
  → BARIQ correlates: pour variance + inventory + sales
  → Discovers: over-pouring during peak periods
  → Estimated impact: $425
  → Recommends: Review pour controls
  → Manager approves action
```

### Scenario 2: Event-Driven Demand Forecast
```
Saturday Music Festival (20,000 attendees) + 94°F weather
  → BARIQ forecasts: +24% beverage demand
  → Current inventory insufficient
  → Recommends: Order 4 cases tequila, 180 lbs chicken
  → Manager approves → PO created
```

### Scenario 3: Food Quality Correlation
```
Chicken Wings: revenue strong but experience declining
  → BARIQ correlates: waste up 14%, customer score 79/100
  → Potential contributing factors: portion/prep inconsistency
  → Recommends: Review preparation process
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard` | Dashboard with KPIs and alerts |
| GET | `/api/inventory` | Inventory with variance status |
| GET | `/api/inventory/variance` | Detailed variance report |
| GET | `/api/sales` | Sales data |
| GET | `/api/revenue` | Revenue analytics |
| GET | `/api/forecast` | Demand forecast |
| GET | `/api/weather` | Weather data |
| GET | `/api/events` | Local events |
| GET | `/api/experience` | Customer experience health score |
| GET | `/api/feedback` | Verified feedback list |
| POST | `/api/feedback` | Submit feedback |
| POST | `/api/vision/analyze` | Bottle vision analysis |
| POST | `/api/agent/message` | BARIQ agent conversation |
| GET | `/api/recommendations` | Recommendations list |
| POST | `/api/recommendations/{id}/approve` | Approve recommendation |
| GET | `/api/audit` | Audit trail |
| POST | `/api/demo/reset` | Reset demo data |

---

## Environment Variables

```bash
AI_PROVIDER=mock          # mock | openai
OPENAI_API_KEY=           # Only if AI_PROVIDER=openai
DATABASE_URL=sqlite:///./bariq_demo.db
DEMO_MODE=true
```

---

## Embedding BARIQ (Component Architecture)

```tsx
<BariqAgent
  locationId="downtown"
  userId="alex"
  context={{
    screen: "inventory",
    entityType: "product",
    entityId: "don-julio-1942"
  }}
/>

<BariqInsightCard />
<BariqRecommendation />
<BariqExperienceWidget />
```

---

## Demo Data

**Organization:** Urban Pour Hospitality

**Locations:** Downtown Social, Midtown Social, Airport Social

**Products:** 29 items (spirits, beer, wine, cocktails, food)

**Sales:** 30 days of realistic historical data

---

## Reset Demo

Click "Reset Demo" button on the Audit page, or:

```bash
curl -X POST http://localhost:8000/api/demo/reset
```

---

## What BARIQ Is NOT

- ❌ Not a POS replacement
- ❌ Not an accounting system
- ❌ Not a standalone restaurant app
- ❌ Not a review website

## What BARIQ IS

- ✅ An embedded intelligence layer
- ✅ Connects existing data sources
- ✅ Provides insight → prediction → recommendation → action → verification
- ✅ Makes existing technology intelligent
