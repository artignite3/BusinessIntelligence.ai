# 💻 Executive Decision Canvas UI (`/frontend`)

This directory contains the **Interactive Executive Decision Canvas** designed for business leaders and operations leads to explore KPI anomalies, examine Shapley causal breakdowns, inspect customer voice tickets, and execute 1-click action recommendations.

---

## 📁 Directory Structure
```
frontend/
├── app/
│   ├── layout.tsx          # Next.js Root Layout with Theme Provider
│   ├── page.tsx            # Master Next.js 14 React Executive Canvas Component
│   └── globals.css         # Tailwind & Typography imports
├── index.html              # Standalone Executive Canvas Web Dashboard (HTML5 + Tailwind)
├── app.js                  # Chart.js time-series renderer & Theme Switcher logic
├── styles.css              # Formal Bright & Deep Slate Dual-Theme stylesheet
├── tailwind.config.js      # Tailwind CSS configuration with dark: 'class'
├── package.json            # React 18, Next.js 14, Recharts, Framer-motion, Lucide-react
└── README.md               # Directory documentation
```

---

## 🎨 Core UI/UX Capabilities & Cool Libraries

1. **Dual Formal Theme Engine (Light & Dark Mode Switcher):**
   * **☀️ Bright Formal Executive Mode:** Crisp white & slate background (`#F8FAFC`, `#FFFFFF`), deep purple typography (`#7C3AED`), high-contrast metric badges.
   * **🌙 Deep Space Dark Mode:** Space slate background (`#070B14`, `#0D1322`), Accenture Royal Purple glow accents (`#A100FF`).
   * One-click Sun/Moon toggle button with instant smooth transition.
2. **Dynamic Animated Time-Series Charts (`recharts` & `chart.js`):**
   * Responsive Area chart with purple gradient area fills and 7-day STL baseline dashed line.
   * Pulsing red reference point indicating statistical anomalies ($\mathcal{Z} \ge 2.50\sigma$).
3. **Smooth Micro-Interactions (`framer-motion`):**
   * Animated tab switching between Benchmark Scenarios.
   * Smooth entrance modals for **Active Learning Feedback** and **Contract YAML Inspector**.
4. **Interactive 7-Pillar Action Matrix:**
   * **1-Click Execute Action** button that transitions into animated `"Dispatched to ERP/WMS (200 OK)"` state.
   * Toast notification feedback system.
5. **Universal Multi-Device Responsiveness:**
   * Mobile (320px–480px), Tablets (768px–1024px), Laptops & Ultra-Wide Desktops.

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
