# BARIQ Demo Meeting Agenda

## Meeting Details
- **Duration:** 10 minutes
- **Product:** BARIQ — Beverage Analytics & Revenue Intelligence Quad
- **Client Persona:** Urban Pour Hospitality (3 locations)
- **Presenter:** [Your Name]

---

## Agenda (10 Minutes)

| Time | Section | Duration |
|------|---------|----------|
| 0:00 | Opening & Problem Statement | 1 min |
| 1:00 | Live Demo — Dashboard & AI Agent | 2 min |
| 3:00 | Live Demo — Vision Analysis | 2 min |
| 5:00 | Live Demo — Inventory, Forecast & Recommendations | 2 min |
| 7:00 | Architecture & Integration Story | 1 min |
| 8:00 | Business Impact & ROI | 1 min |
| 9:00 | Q&A | 1 min |

---

## 1. Opening & Problem Statement (1 min)

**The Hook:**
> "A typical bar loses 20-25% of beverage revenue to operational inefficiency — over-pouring, inventory inaccuracy, missed demand signals, and unexplained variance. For a 3-location group doing $4.2M in annual revenue, that's $840K–$1M walking out the door."

**What is BARIQ:**
> "BARIQ is an embedded agentic AI intelligence layer that sits inside your existing operations app — not a separate tool. It watches your POS, inventory, events, weather, and customer feedback in real-time, and proactively tells you what to do before problems become losses."

---

## 2. Dashboard & AI Agent (2 min)

**Show:**
- KPI cards (Revenue, Pour Cost, Variance, Customer Satisfaction)
- Real-time alerts with severity
- BARIQ Agent panel — ask "What should I focus on today?"
- Agent responds with prioritized, actionable insight

**Key Talking Points:**
- "This isn't a reporting tool — it's a decision layer"
- "The agent understands context: weather, events, historical patterns"
- "Every metric has an ⓘ tooltip — no ambiguity about definitions"

---

## 3. Vision Analysis (2 min)

**Show:**
- Upload a real bottle photo (or use demo)
- AI identifies brand, estimates fill level
- Three-way reconciliation: Vision vs. Inventory vs. POS
- Multi-bottle: show shelf photo detecting multiple bottles

**Key Talking Points:**
- "One photo replaces 30 minutes of manual counting"
- "Cross-references against what POS says you sold — finds discrepancies automatically"
- "With OpenAI Vision, it recognizes any bottle — not limited to a preset list"

---

## 4. Inventory, Forecast & Recommendations (2 min)

**Show:**
- Category tabs: Spirits, Beer, Wine, Food
- Variance flagging with status colors
- Demand Forecast page with event intelligence (Ticketmaster)
- Recommendations page — AI-generated purchase orders

**Key Talking Points:**
- "Knows a Taylor Swift concert is Saturday → auto-adjusts forecast"
- "Recommends ordering 3 extra cases of Tito's before the event"
- "One-click approval generates a purchase order"

---

## 5. Architecture & Integration (1 min)

**Show (briefly):**
- Diagram or verbal: "BARIQ sits between your POS, inventory system, and external data"
- Mock AI providers → swap to real OpenAI/Claude with one config change
- Excel upload + JSON API for live data ingestion
- Ticketmaster, weather APIs for demand signals

**Key Talking Points:**
- "Designed to embed into YOUR existing app — not replace it"
- "API-first: integrates with Toast, Square, Lightspeed, or custom POS"
- "Works offline with mock providers — no vendor lock-in"

---

## 6. Business Impact & ROI (1 min)

### Quantified Benefits

| Metric | Before BARIQ | With BARIQ | Impact |
|--------|-------------|------------|--------|
| Pour Cost % | 24-28% | 18-21% | **-6% cost reduction** |
| Inventory Variance | 8-12% | 2-4% | **$180K/yr saved** |
| Stockouts per month | 12-15 | 2-3 | **$45K/yr recovered** |
| Manual count time | 6 hrs/week | 1 hr/week | **260 hrs/yr freed** |
| Demand forecast accuracy | 65% | 89% | **24% improvement** |

### ROI Summary (3-location group, $4.2M annual revenue)

| Category | Annual Savings |
|----------|---------------|
| Reduced unexplained variance | $180,000 |
| Optimized purchasing (less waste) | $95,000 |
| Demand-driven revenue capture | $120,000 |
| Labor savings (automated counts) | $35,000 |
| **Total Annual Benefit** | **$430,000** |
| **Estimated Annual Cost** | **$48,000** |
| **ROI** | **~9x** |

---

## 7. Q&A (1 min)

**Anticipated Questions:**

- **"How long to implement?"** → 2-4 weeks. API integration + POS connector + training.
- **"Does it work with our POS?"** → API-first design. Connectors for Toast, Square, Lightspeed, Aloha. Custom POS via webhook/CSV.
- **"What about privacy/cameras?"** → Vision is opt-in, photo-based (not live video). Images processed and discarded — no storage. No facial recognition.
- **"Can it scale beyond 3 locations?"** → Built multi-tenant from day one. Handles 100+ locations with the same architecture.
- **"What makes this different from BevSpot/Partender?"** → Those are inventory tools. BARIQ is an intelligence layer — it combines vision + demand forecasting + event data + AI agent into a proactive system that tells you what to do, not just what happened.

---

## High-Level Benefits Summary

### For Bar Managers
- 🥃 **Know exactly what's on every shelf** without manual counting
- 📊 **See problems before they cost money** — proactive alerts, not reactive reports
- 🎯 **Order the right amount** — AI adjusts for events, weather, trends

### For Owners / GMs
- 💰 **$430K annual savings** for a 3-location group
- 📉 **Cut pour cost by 6 percentage points** (industry-leading)
- 🔍 **Full audit trail** — every recommendation, approval, and variance documented

### For Operations Teams
- ⏱️ **260 hours/year saved** on manual inventory counts
- 🧠 **AI does the analysis** — humans make decisions with context
- 📱 **Works inside your existing app** — no new login, no new tool to learn

### Competitive Differentiators
1. **Embedded AI Agent** — conversational, context-aware, proactive
2. **Computer Vision** — real bottle recognition, not just barcode scanning
3. **Three-Way Reconciliation** — Vision × Inventory × POS (unique to BARIQ)
4. **Event-Driven Forecasting** — Ticketmaster + weather + historical patterns
5. **Never says "theft"** — language designed for trust, not accusation

---

## Demo Environment

```bash
# Start backend
cd bariq-demo/backend
export OPENAI_API_KEY=sk-...  # for real vision
uvicorn app.main:app --reload --port 8000

# Start frontend (new terminal)
cd bariq-demo/frontend
npm run dev

# Open: http://localhost:3000
```

**Demo credentials:** Auto-logged in as Alex Morgan, GM of Urban Pour Hospitality

---

*"BARIQ doesn't replace your bar manager — it gives them superpowers."*
