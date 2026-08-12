# BARIQ Demo — Customer Presentation Guide

## Meeting Setup

| Item | Detail |
|------|--------|
| Duration | 20–25 minutes |
| Audience | Restaurant/bar owners, hospitality operators, investors |
| Presenter | Product lead or solutions architect |
| Equipment | Laptop, external display/projector, browser full-screen |
| Pre-check | Backend + frontend running, browser on `http://localhost:3000` |

---

## Opening (2 minutes)

### The Problem Statement

> "You already have a POS. You already have inventory software. You already have a reservation system.
>
> But none of them talk to each other. None of them tell you what's actually happening in your business right now — or what's about to happen tomorrow.
>
> BARIQ doesn't replace any of that. BARIQ makes all of it intelligent."

### Key Positioning Line

> "BARIQ is an embedded intelligence layer. It connects your existing systems and turns disconnected data into decisions."

---

## Act 1 — The Existing Application (1 minute)

**What to show:** The sidebar, navigation, and overall layout.

**Script:**

> "This is Urban Pour Operations — a typical restaurant management platform. You've got your Dashboard, Inventory, Menu, Customers, Reports.
>
> Notice the purple button in the top right — Ask BARIQ. That's the intelligence layer, embedded right inside the app your team already uses. No new login. No new tool to learn."

**Highlight:**
- Point to sidebar navigation (the "existing" app)
- Point to BARIQ intelligence section (the embedded AI layer)
- Point to the DEMO MODE banner — "This runs entirely on your local machine. No cloud. No API keys."

---

## Act 2 — Morning Intelligence Brief (2 minutes)

**What to show:** Dashboard KPIs and alerts.

**Script:**

> "Alex is a regional manager. She opens the app Monday morning. Before she asks anything, BARIQ has already analyzed overnight data and tells her:
>
> Revenue is up 8.2%. Good.
> Beverage is outperforming food. Interesting.
> But margin dropped 2.3%. That needs attention.
> And there's a tequila inventory problem. That needs action."

**Highlight each alert:**

| Alert | What it means |
|-------|---------------|
| 🔴 Tequila variance | Money is walking out the door |
| 🟠 Saturday demand | Opportunity to capture more revenue |
| 🟠 Chicken stock-out | Risk of disappointing customers |
| 🟢 Beverage opportunity | Proactive revenue growth |

**Key point:**

> "BARIQ doesn't wait for you to ask. It finds problems and opportunities, then brings them to you."

---

## Act 3 — Inventory Intelligence (3 minutes)

**What to show:** Click Inventory in sidebar.

**Script:**

> "Let's look at that tequila problem. Here's the inventory table. See Don Julio 1942 — red status.
>
> Expected 18 bottles. Actual count is 16.3. That's a 1.7 bottle variance worth $425.
>
> But we don't call this theft. We call it 'unexplained operational variance' because there are six possible causes — over-pouring, breakage, receiving errors, counting mistakes, POS mismatches, or yes, occasionally something else."

**Highlight the Pour Intelligence section:**

> "BARIQ calculates that this bottle has 487ml remaining. At 30ml per standard pour, that's 16 servings left. But the system expected 18 servings. That's $86 in potential revenue impact — just from one bottle."

**Key point:**

> "This isn't just a number on a spreadsheet. BARIQ connects quantity to money to action."

---

## Act 4 — Computer Vision (2 minutes)

**What to show:** Click Vision. Click "Analyze Bottle."

**Script:**

> "Now, what if you could just point a camera at a bottle and know exactly what's in it?
>
> Click Analyze. BARIQ identifies the bottle — Don Julio 1942, 96% confidence. It estimates 65% fill level. That's approximately 487ml, or about 16 servings.
>
> But here's where it gets powerful — the three-way reconciliation."

**Point to the comparison:**

| Source | Servings |
|--------|----------|
| Vision | 16 |
| Inventory System | 18 |
| POS Records | 17 |

> "Three different data sources. Three different numbers. BARIQ flags the discrepancy and says: 'Perform a manual count. Confidence: 84%.'
>
> That's not an accusation. It's an investigation prompt."

---

## Act 5 — Customer Experience (2 minutes)

**What to show:** Click Experience.

**Script:**

> "Here's something no other bar intelligence tool does. We connect customer feedback directly to operational data.
>
> See the health scores: Overall 71. Food 79. Beverage 69. Wait time 60.
>
> Wait time is the lowest. BARIQ doesn't just show you the number — it tells you WHY."

**Point to Root Cause Analysis:**

> "Beverage experience declined 9% at Downtown Social. The biggest drop happens Friday and Saturday between 8 and 10 PM. That same period shows 22% more orders but 14% longer wait times and 8% more pour variance.
>
> The potential contributing factor? Peak demand exceeds bar throughput.
>
> Notice: we say 'potential contributing factors.' BARIQ doesn't claim causation it can't prove."

**Key point:**

> "This is the chain that matters: Customer says 'my drink was inconsistent' → BARIQ traces it back to over-pouring during rush hour → connects it to the inventory variance we saw earlier."

---

## Act 6 — Demand Forecasting (2 minutes)

**What to show:** Click Forecast.

**Script:**

> "Saturday is coming. There's a music festival downtown — 20,000 people, 1.2 miles away. Temperature: 94°F.
>
> BARIQ combines historical Saturday patterns, the weather, and the event to predict:
>
> Beer demand up 18%. Cocktails up 24%. Tequila up 27%. Chicken wings up 21%.
>
> And it immediately flags: 'Your current tequila inventory won't cover this. Your chicken stock won't cover this.'"

**Key point:**

> "This isn't a guess. It's three data sources — history, weather, events — weighted together. Confidence: 86%."

---

## Act 7 — The Agent (3 minutes)

**What to show:** Click "Ask BARIQ" button. The agent panel opens.

**Script:**

> "Now the conversational part. Alex can ask questions in plain English."

**Demo these questions in sequence:**

**Question 1:** Click "Why is tequila variance high?"

> "See the response: structured, not just text. There's an Answer, Evidence with specific numbers, a Recommendation, and a Confidence score. Every number comes from the database — BARIQ never invents data."

**Question 2:** Click "What should I order?"

> "BARIQ looks at the forecast, current inventory, and supplier lead times, then says: Order 4 cases tequila, 180 lbs chicken, 12 cases beer. Total opportunity: $5,400.
>
> And there's an Approve button right here."

**Click Approve on "Order 4 Cases Tequila":**

> "Done. Purchase order created. PO-2026-00701. $1,920. No phone call, no spreadsheet, no email chain. Ask → Recommend → Approve → Done."

---

## Act 8 — Action Workflow (1 minute)

**What to show:** Click Actions in sidebar.

**Script:**

> "All recommendations live here. Each has an impact value and confidence score. The team can Approve, Modify, or Reject.
>
> When approved, BARIQ creates the operational action — a PO, a staffing change, a process review — and logs everything."

---

## Act 9 — Audit Trail (1 minute)

**What to show:** Click Audit.

**Script:**

> "Every question asked. Every tool BARIQ used. Every recommendation made. Every approval or rejection. Timestamped, attributed to a user.
>
> This is enterprise-grade accountability. If an auditor asks 'why did you order 4 cases of tequila last Saturday?' — the answer is right here, with the data that supported the decision."

---

## Closing (2 minutes)

### The Value Chain

Draw this on a whiteboard or show verbally:

```
INSIGHT → PREDICTION → RECOMMENDATION → ACTION → VERIFICATION → LEARNING
```

> "Most tools stop at dashboards. BARIQ goes all the way to action and then measures whether the action worked.
>
> Customer complained about inconsistent drinks.
> BARIQ found the pour variance.
> Connected it to inventory loss.
> Recommended pour controls.
> Manager approved.
> Next week: measure if experience improved.
>
> That's a closed loop. That's intelligence."

### The Integration Story

> "We didn't ask you to rip out your POS. We didn't replace your inventory system. We sat inside your existing technology and made it smarter.
>
> Tomorrow, this connects to Toast, to Square, to Restaurant365, to WISK, to real weather APIs, to real event feeds. The architecture is ready. The intelligence layer stays the same."

### Call to Action

> "What I showed you today runs entirely on a laptop. No cloud account. No subscription. No API key.
>
> Imagine this connected to your actual data. What would it find in your business this week?"

---

## Objection Handling

| Objection | Response |
|-----------|----------|
| "We already have inventory software" | "BARIQ doesn't replace it. It reads from it, adds intelligence, and gives you actions." |
| "How is this different from a dashboard?" | "Dashboards show you what happened. BARIQ tells you why, what's coming next, and what to do about it." |
| "AI makes things up" | "BARIQ never invents a number. Every revenue figure, every inventory count comes from your database. The AI only explains and recommends." |
| "We're too small for this" | "This demo runs on a laptop. A single location with 20 products already surfaces $5,000+ in weekly insights." |
| "What about data security?" | "BARIQ is embedded inside your existing application. Your data never leaves your infrastructure. We don't see it." |
| "How long to integrate?" | "The embedded components are drop-in React widgets. A typical POS integration takes 2–4 weeks." |

---

## Do's and Don'ts

### Do

- ✅ Let the alerts speak first — don't explain everything manually
- ✅ Click through quickly — momentum matters
- ✅ Use the agent live — type a real question if the audience suggests one
- ✅ Emphasize "embedded" — BARIQ is inside their app, not a separate tool
- ✅ Say "potential contributing factors" — never claim certain causation
- ✅ Show the approval flow — executives love governance

### Don't

- ❌ Don't say "theft" — say "unexplained operational variance"
- ❌ Don't over-explain the tech stack — focus on business outcomes
- ❌ Don't demo the Swagger docs unless asked
- ❌ Don't promise real-time camera integration in V1
- ❌ Don't linger on any single screen more than 90 seconds

---

## Backup: If Something Breaks

| Issue | Quick fix |
|-------|-----------|
| Backend crashed | `Ctrl+C` → `uvicorn app.main:app --reload --port 8000` |
| Frontend blank | Hard refresh: `Cmd+Shift+R` |
| Data looks wrong | Open Audit → click "Reset Demo" |
| Agent not responding | Check backend terminal for errors |
| Need to restart everything | Kill both terminals, `rm -f backend/bariq_demo.db`, restart both |
