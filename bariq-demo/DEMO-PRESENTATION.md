# BARIQ Demo — 10-Minute Customer Presentation

## Setup

| Item | Detail |
|------|--------|
| Duration | **10 minutes** |
| Audience | Restaurant/bar owners, hospitality operators, investors |
| Pre-check | Backend + frontend running, browser full-screen on `http://localhost:3000` |

---

## Flow at a Glance

| # | Section | Time | Screen |
|---|---------|------|--------|
| 1 | Opening + Dashboard | 2 min | Dashboard |
| 2 | Inventory Problem | 1.5 min | Inventory |
| 3 | Vision Proof | 1.5 min | Vision |
| 4 | Customer Connection | 1.5 min | Experience |
| 5 | Forecast + Agent + Action | 2.5 min | Forecast → Agent → Approve |
| 6 | Close | 1 min | Verbal |

---

## 1. Opening + Dashboard (2 min)

**Open `http://localhost:3000`. Don't explain the tech. Start with the story.**

> "Alex manages three bar-restaurants. She opens her operations app Monday morning. BARIQ — the embedded intelligence layer — has already analyzed everything and says:"

**Point to the screen:**

> - Revenue $82K, up 8.2% ✓
> - But margin dropped — that's a cost problem
> - 🔴 Tequila variance — money is leaking
> - 🟠 Saturday demand spike coming
> - 🟢 Revenue opportunity waiting

> "BARIQ doesn't wait to be asked. It finds problems and brings them to you."

---

## 2. Inventory Problem (1.5 min)

**Click Inventory.**

> "Don Julio 1942. Red status. Expected 18 bottles, actual 16.3. That's $425 unexplained variance.
>
> BARIQ also calculates: 487ml left, 16 servings remaining at standard pour. The system expected 18. That's $86 in revenue impact from one bottle."

**Key line:**

> "We don't say theft. We say six possible causes — over-pouring, breakage, receiving error, counting error, POS mismatch, or operational loss. BARIQ investigates, not accuses."

---

## 3. Vision Proof (1.5 min)

**Click Vision. Click "Analyze Bottle."**

> "Point a camera at a bottle. BARIQ recognizes it — 96% confidence. Estimates 65% fill. Then does a three-way check:"

| Source | Servings |
|--------|----------|
| Camera | 16 |
| Inventory | 18 |
| POS | 17 |

> "Three sources disagree. BARIQ flags it instantly. Confidence: 84%. Recommendation: manual count."

---

## 4. Customer Connection (1.5 min)

**Click Experience.**

> "Scores: Overall 71. Wait time — 60. That's the problem.
>
> BARIQ found the root cause: beverage experience dropped 9% specifically Friday-Saturday 8–10 PM. That same window shows 22% more orders, 14% longer waits, 8% more pour variance.
>
> So: customers say 'my drink was inconsistent' → BARIQ traces it to over-pouring during rush → connects to the inventory loss we just saw. One thread, three screens."

---

## 5. Forecast + Agent + Action (2.5 min)

**Click Forecast (15 sec):**

> "Saturday: music festival, 20,000 people, 94°F. BARIQ predicts tequila +27%, cocktails +24%. Current stock won't cover it."

**Click "Ask BARIQ" button (60 sec):**

Click **"What should I order?"**

> "BARIQ says: 4 cases tequila, 180 lbs chicken, 12 cases beer. Total risk avoidance: $5,400."

**Click Approve (30 sec):**

> "One click. Purchase order created. PO-2026. Done.
>
> Ask → Recommend → Approve → Action. That's the full loop in 10 seconds."

**Click Audit (15 sec):**

> "Every decision logged. Who asked, what BARIQ found, what was approved, when. Enterprise-grade audit trail."

---

## 6. Close (1 min)

> "BARIQ doesn't replace your POS. Doesn't replace your inventory tool. It sits inside your existing technology and connects POS + inventory + vision + customer feedback + weather + events into one intelligence layer.
>
> Most tools give you dashboards. BARIQ gives you:
>
> **Insight → Prediction → Recommendation → Action → Verification**
>
> What I showed you runs on a laptop. Imagine it connected to your actual data. What would it find this week?"

---

## If They Ask Questions

| Question | Answer |
|----------|--------|
| "How is this different from a dashboard?" | "Dashboards show what happened. BARIQ tells you why, what's next, and creates the action." |
| "AI makes things up" | "Every number comes from the database. BARIQ never invents revenue or inventory figures." |
| "We already have software" | "BARIQ embeds inside it. Doesn't replace, makes it intelligent." |
| "What does it cost?" | "This runs on a laptop today. Production pricing scales with locations." |
| "How long to integrate?" | "Drop-in React components. Typical POS integration: 2–4 weeks." |

---

## Rules

- ✅ Click fast — momentum over explanation
- ✅ Let the numbers speak — point, don't narrate every pixel
- ✅ Say "potential contributing factors" — never "theft" or "caused by"
- ✅ End on the agent approval — it's the most impressive moment
- ❌ Don't explain the tech stack
- ❌ Don't linger on any screen more than 90 seconds
- ❌ Don't open Swagger or mention Docker

---

## If Something Breaks

| Issue | Fix |
|-------|-----|
| Blank screen | `Cmd+Shift+R` |
| API error | Check backend terminal, restart uvicorn |
| Bad data | Audit page → "Reset Demo" |
