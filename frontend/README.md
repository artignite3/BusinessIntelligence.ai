# 💻 Executive Decision Canvas UI (`/frontend`)

This directory contains the **Interactive Executive Decision Canvas** designed for business leaders and operations leads to explore KPI anomalies, examine Shapley causal breakdowns, inspect customer voice tickets, and execute 1-click action recommendations.

---

## 📁 Directory Structure
```
frontend/
├── index.html          # Executive Canvas Web Dashboard (HTML5 + TailwindCSS)
├── app.js              # Chart.js time-series renderer & REST API client
├── styles.css          # Accenture Purple styling, animations & scrollbars
├── package.json        # Next.js 14 / React dependencies configuration
├── app/
│   └── page.tsx        # Next.js 14 App Router React Component
└── README.md           # Directory documentation
```

---

## 🎨 Core UI Capabilities

1. **Dynamic Time-Series Chart (Chart.js):**
   * Renders 45-day Net Revenue trajectory with 7-day STL baseline trendline.
   * Pulsing red markers indicate statistical anomalies ($\mathcal{Z} \ge 2.50\sigma$).
2. **Scenario Selector Bar:**
   * Instant switching between *Scenario 1 (Multi-Factor Drop)*, *Scenario 2 (Abstention)*, and *Scenario 3 (Cold-Start Launch)*.
3. **Persona Toggle Dropdown (RBAC):**
   * Toggles view between **VP Commercial** (unmasked margins, macro strategy) and **Regional Ops Lead** (masked costs, carrier rerouting levers).
4. **Autonomous Abstention Banner:**
   * Displays high-visibility warning when Bayesian confidence $< 60\%$.
5. **7-Pillar Action Matrix Card:**
   * Displays Controllable Lever, Prescribed Action, Expected Impact, and Owner.
   * Includes **1-Click Execute Action** button and **Active Learning Feedback Modal**.
6. **Live Telemetry & Economics Bar:**
   * Displays real-time latency ($345\text{ms}$), token count ($420$), and cost per insight ($\$0.00028$).

---

## 🚀 Running the Frontend

### Option A: Zero-Config Direct Browser Preview
Double click and open `frontend/index.html` in any modern web browser. It features automatic offline fallback simulation.

### Option B: Served via FastAPI Gateway
Start the backend (`python -m uvicorn backend.main:app --port 8000`) and navigate to:
👉 **[http://127.0.0.1:8000/dashboard/](http://127.0.0.1:8000/dashboard/)**

### Option C: Next.js 14 App Router Mode
```bash
cd frontend
npm install
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).
