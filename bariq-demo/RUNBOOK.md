# BARIQ Demo — macOS Runbook

## Prerequisites

### Required Software

| Software | Version | Install Command |
|----------|---------|-----------------|
| Node.js | 20+ | `brew install node` |
| Python | 3.11+ | `brew install python@3.11` |
| Git | Latest | `brew install git` |
| Docker (optional) | Latest | `brew install --cask docker` |

### Verify Installations

```bash
node --version    # Expected: v20.x or higher
npm --version     # Expected: 10.x or higher
python3 --version # Expected: 3.11.x or higher
pip3 --version    # Expected: 24.x or higher
```

---

## Option A: Run Without Docker (Recommended for Demo)

### Step 1 — Clone / Navigate to Project

```bash
cd /path/to/bariq-demo
```

### Step 2 — Start the Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
```

Leave this terminal running.

### Step 3 — Start the Frontend

Open a **new terminal tab** (`Cmd + T`):

```bash
cd /path/to/bariq-demo/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Expected output:

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

### Step 4 — Open the Demo

Open your browser:

```
http://localhost:3000
```

Swagger API docs:

```
http://localhost:8000/docs
```

---

## Option B: Run With Docker

### Step 1 — Ensure Docker Desktop is Running

Open Docker Desktop from Applications, or:

```bash
open -a Docker
```

Wait until the Docker icon in the menu bar shows "Docker Desktop is running."

### Step 2 — Build and Start

```bash
cd /path/to/bariq-demo

docker compose up --build
```

First build takes 1–2 minutes. Expected output:

```
✓ Container bariq-demo-backend-1   Started
✓ Container bariq-demo-frontend-1  Started
```

### Step 3 — Open the Demo

```
http://localhost:3000    # Frontend
http://localhost:8000    # Backend API
http://localhost:8000/docs  # Swagger
```

### Step 4 — Stop

```bash
docker compose down
```

---

## Demo Walkthrough (Presenter Script)

### Scene 1 — Dashboard (30 seconds)

1. Open `http://localhost:3000`
2. Point out: "This is Urban Pour Operations — an existing restaurant management platform"
3. Highlight the BARIQ Intelligence section with alerts:
   - 🔴 Tequila variance — $425
   - 🟠 Saturday demand — +24%
   - 🟠 Chicken stock-out risk
   - 🟢 Beverage demand opportunity
4. Note KPIs: Revenue $82K, Margin 68.4%

### Scene 2 — Inventory (30 seconds)

1. Click **Inventory** in sidebar
2. Show the table — Don Julio 1942 is RED
3. Point out: On Hand 16.3 vs Expected 18.0 = 1.7 bottle variance
4. Show Pour Intelligence section: 487ml remaining, 16 servings, $86 revenue impact

### Scene 3 — Vision Analysis (30 seconds)

1. Click **Vision** in sidebar
2. Click **"Analyze Bottle"**
3. Show results: 96% confidence recognition, 65% fill level
4. Highlight the 3-way reconciliation: Vision (16) vs Inventory (18) vs POS (17)
5. Point out: "BARIQ correlates multiple data sources automatically"

### Scene 4 — Customer Experience (30 seconds)

1. Click **Experience** in sidebar
2. Show health scores: Overall 71, Wait Time 60 (low)
3. Show root-cause analysis: "Beverage experience declined 9% at Downtown Social"
4. Point out verified feedback with transaction data attached

### Scene 5 — Forecast (30 seconds)

1. Click **Forecast** in sidebar
2. Show Saturday forecast: Tequila +27%, Cocktails +24%
3. Point out factors: Music Festival (20,000 people), 94°F weather
4. Show inventory risks: stock-out warnings

### Scene 6 — Ask BARIQ Agent (60 seconds)

1. Click **"Ask BARIQ"** button (top right, purple)
2. Agent panel opens with greeting + 3 priority items
3. Click: **"Why is tequila variance high?"**
4. Show structured response: Answer, Evidence, Recommendation, Confidence
5. Click: **"What should I order?"**
6. Show: 4 cases tequila recommendation with **Approve** button
7. Click **Approve** — PO created

### Scene 7 — Recommendations (20 seconds)

1. Click **Actions** in sidebar
2. Show 4 pending recommendations with impact values
3. Approve one — show PO creation confirmation

### Scene 8 — Audit Trail (20 seconds)

1. Click **Audit** in sidebar
2. Show complete decision history: agent queries, approvals, PO creation
3. Point out: "Every AI recommendation is tracked and auditable"

### Closing (15 seconds)

> "BARIQ doesn't replace existing restaurant technology. It makes it intelligent.
> POS + Inventory + Vision + Customer Experience + Weather + Events →
> Insight → Prediction → Recommendation → Action → Verification."

---

## Troubleshooting

### Backend won't start

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Ensure venv is activated: `source venv/bin/activate` |
| Port 8000 in use | Kill existing: `lsof -ti:8000 \| xargs kill -9` |
| SQLite permission error | Delete `bariq_demo.db` and restart |

### Frontend won't start

| Problem | Solution |
|---------|----------|
| `npm install` fails | Delete `node_modules` and retry: `rm -rf node_modules && npm install` |
| Port 3000 in use | Kill existing: `lsof -ti:3000 \| xargs kill -9` |
| Blank page | Check browser console; ensure backend is running |

### API returns errors

| Problem | Solution |
|---------|----------|
| CORS errors in browser | Verify backend is on port 8000 |
| 500 errors | Check backend terminal for traceback |
| Empty data | Reset demo: click "Reset Demo" on Audit page |

### Docker issues

| Problem | Solution |
|---------|----------|
| Docker not running | Open Docker Desktop app |
| Port conflict | `docker compose down` then `docker compose up --build` |
| Stale containers | `docker compose down -v && docker compose up --build` |

---

## Reset Demo Data

If the demo data gets into a bad state, reset it:

**Via UI:** Go to Audit page → click **"Reset Demo"** button

**Via API:**

```bash
curl -X POST http://localhost:8000/api/demo/reset
```

**Via file system (backend without Docker):**

```bash
cd backend
rm -f bariq_demo.db
# Restart uvicorn — database re-seeds automatically
```

---

## Environment Variables

Copy `.env.example` to `.env` if you want to customize:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `mock` | Use `mock` for demo (no API key needed) |
| `OPENAI_API_KEY` | (empty) | Only needed if `AI_PROVIDER=openai` |
| `DATABASE_URL` | `sqlite:///./bariq_demo.db` | SQLite path |
| `DEMO_MODE` | `true` | Shows demo banner |

---

## Network Requirements

The demo runs **entirely offline**. No internet connection is needed once dependencies are installed.

- No external API calls (mock providers)
- No cloud databases
- No external authentication

---

## Hardware Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Disk | 500 MB | 1 GB |
| CPU | Any modern Mac | Apple Silicon or Intel i5+ |
| Display | 1280×720 | 1920×1080 (for demo projection) |

---

## Quick Reference Commands

```bash
# Start backend (from bariq-demo/backend)
source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Start frontend (from bariq-demo/frontend)
npm run dev

# Stop everything
# Ctrl+C in both terminal tabs

# Full reset
rm -f backend/bariq_demo.db && curl -s localhost:8000/api/health

# Docker start
docker compose up --build

# Docker stop
docker compose down
```
