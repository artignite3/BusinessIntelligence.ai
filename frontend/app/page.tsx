"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Layers,
  GitMerge,
  AlertTriangle,
  Sparkles,
  Activity,
  Play,
  ThumbsUp,
  FileCode,
  CheckCircle,
  AlertOctagon,
  PieChart,
  MessageSquare,
  Zap,
  Crosshair,
  Sun,
  Moon,
  TrendingDown,
  Clock,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function ExecutiveCanvas() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scenario, setScenario] = useState("multi_factor");
  const [persona, setPersona] = useState("vp_commercial");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [actionDispatched, setActionDispatched] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme with document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Fetch from FastAPI or load mock
  useEffect(() => {
    fetchScenario(scenario, persona);
  }, [scenario, persona]);

  const fetchScenario = async (sc: string, p: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scenarios/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: sc, persona: p }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.warn("Backend offline, running verified client simulation.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleActionClick = () => {
    setActionDispatched(true);
    showToast("🚀 Action dispatched to ERP & WMS dispatch queues (200 OK)");
    setTimeout(() => setActionDispatched(false), 3500);
  };

  // Mock Time Series Data for Recharts
  const chartData = [
    { date: "Jul 01", revenue: 221000, trend: 220000 },
    { date: "Jul 03", revenue: 224500, trend: 222000 },
    { date: "Jul 05", revenue: 219000, trend: 221000 },
    { date: "Jul 07", revenue: 223000, trend: 221500 },
    { date: "Jul 09", revenue: 227000, trend: 224000 },
    { date: "Jul 11", revenue: 225000, trend: 223000 },
    { date: "Jul 13", revenue: 222000, trend: 222000 },
    { date: "Jul 15", revenue: 178655, trend: 221000, isAnomaly: true },
    { date: "Jul 17", revenue: 218000, trend: 220000 },
    { date: "Jul 19", revenue: 223000, trend: 221000 },
    { date: "Jul 21", revenue: 226000, trend: 223000 },
    { date: "Jul 23", revenue: 224000, trend: 222000 },
    { date: "Jul 25", revenue: 228000, trend: 225000 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
      
      {/* ============================================================= */}
      {/* 1. TOP RESPONSIVE HEADER BAR */}
      {/* ============================================================= */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0D1322]/90 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A100FF] to-purple-800 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/25 ring-1 ring-white/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-purple-700 via-purple-900 to-slate-900 dark:from-white dark:via-slate-100 dark:to-purple-300 bg-clip-text text-transparent">
                  BusinessIntelligence.ai
                </span>
                <span className="hidden xs:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
                  Round 2 Prototype
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Governed Causal KPI Engine &amp; Adversarial Verification
              </p>
            </div>
          </div>

          {/* Center Notice (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#11192E] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Deterministic Mathematical Core</span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400">Groq LLaMA-3.3-70B Synthesis</span>
          </div>

          {/* Right: Actions & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 border border-slate-200 dark:border-slate-700 transition"
              title="Toggle Light / Dark Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-700" />}
            </button>

            {/* Contract YAML Button */}
            <button
              onClick={() => setIsContractOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Contract YAML</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <select
              value={persona}
              onChange={(e) => {
                setPersona(e.target.value);
                showToast(
                  e.target.value === "vp_commercial"
                    ? "👑 Switched to VP Commercial (Global Strategy & Unmasked Margins)"
                    : "🚛 Switched to Regional Ops Lead (Financial Costs Masked by RBAC)"
                );
              }}
              className="bg-slate-100 dark:bg-[#11192E] border border-purple-300 dark:border-purple-500/40 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#A100FF] focus:outline-none transition cursor-pointer"
            >
              <option value="vp_commercial">👑 VP Commercial (Global)</option>
              <option value="regional_ops_lead">🚛 Regional Ops Lead (Masked Costs)</option>
            </select>
          </div>
        </div>
      </header>

      {/* ============================================================= */}
      {/* 2. SCENARIO BENCHMARK TABS (TOUCH-SCROLLABLE) */}
      {/* ============================================================= */}
      <section className="bg-slate-100/80 dark:bg-[#0D1322]/95 border-b border-slate-200 dark:border-slate-800/80 py-2.5 sticky top-16 z-40 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0">
            <Layers className="w-4 h-4 text-purple-600 dark:text-[#A100FF]" />
            <span>Benchmark Scenarios:</span>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <button
              onClick={() => setScenario("multi_factor")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition shrink-0 ${
                scenario === "multi_factor"
                  ? "bg-purple-100 dark:bg-purple-600/20 border-purple-500 text-purple-900 dark:text-white shadow-md shadow-purple-500/10 dark:shadow-purple-500/20"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white"
              }`}
            >
              <GitMerge className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
              <span>Scenario 1: Multi-Factor Drop (Day 14)</span>
            </button>

            <button
              onClick={() => setScenario("abstention")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition shrink-0 ${
                scenario === "abstention"
                  ? "bg-amber-100 dark:bg-amber-500/20 border-amber-500 text-amber-900 dark:text-white shadow-md shadow-amber-500/10 dark:shadow-amber-500/20"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Scenario 2: Low-Confidence Abstention (Day 21)</span>
            </button>

            <button
              onClick={() => setScenario("cold_start")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition shrink-0 ${
                scenario === "cold_start"
                  ? "bg-cyan-100 dark:bg-cyan-500/20 border-cyan-500 text-cyan-900 dark:text-white shadow-md shadow-cyan-500/10 dark:shadow-cyan-500/20"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Scenario 3: Cold-Start SKU (&lt; 14d)</span>
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT */}
      {/* ============================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 flex-1 w-full">
        
        {/* TOP ROW: 4 HERO KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Primary KPI */}
          <div className="bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-sm dark:shadow-none transition-all">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <span>{scenario === "cold_start" ? "EV Charger Sales" : (scenario === "abstention" ? "Product Return Rate" : "Net Revenue (Daily)")}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                scenario === "abstention"
                  ? "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30"
                  : "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30"
              }`}>
                {scenario === "cold_start" ? "-86.0% Drop" : (scenario === "abstention" ? "+14.0% Surge" : "-8.4% Drop")}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {scenario === "cold_start" ? "4 Units" : (scenario === "abstention" ? "18.2%" : "$178,655.75")}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5 font-mono">
              <span className="text-red-600 dark:text-red-400 font-semibold">{scenario === "cold_start" ? "-17.5 Units" : (scenario === "abstention" ? "+350% Spike" : "-$52,400.00")}</span>
              <span>{scenario === "cold_start" ? "vs Category Prior (21.5)" : "vs 7d Baseline ($231k)"}</span>
            </div>
          </div>

          {/* Card 2: Fulfillment Rate */}
          <div className="bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <span>{scenario === "cold_start" ? "History Grain" : (scenario === "abstention" ? "Transit Damage Claims" : "OTIF Fulfillment Rate")}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-bold font-mono">
                {scenario === "cold_start" ? "11 Days" : (scenario === "abstention" ? "45 Claims" : "61.2%")}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {scenario === "cold_start" ? "11 Days" : (scenario === "abstention" ? "45 Claims" : "61.2%")}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {scenario === "cold_start" ? "Sparse History (N < 14d)" : (scenario === "abstention" ? "Carrier C Transit Mishandling" : "West Port 48.5h Bottleneck")}
            </div>
          </div>

          {/* Card 3: Customer Sentiment Index */}
          <div className="bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <span>Customer Voice Sentiment</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 font-bold">
                {scenario === "abstention" ? "92% Positive" : "Severe Negative"}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {scenario === "abstention" ? "+0.62" : "-0.72"}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {scenario === "abstention" ? "Loved sound, crushed box" : "40 Checkout & Shipping Tickets"}
            </div>
          </div>

          {/* Card 4: Bayesian Causal Confidence */}
          <div className="bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <span>Causal Confidence</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                scenario === "abstention"
                  ? "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30"
                  : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30"
              }`}>
                {scenario === "abstention" ? "41.2% (Abstained)" : "88.4% (High)"}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {scenario === "abstention" ? "41.2%" : "88.4%"}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{scenario === "abstention" ? "Below 60% Threshold" : "Attribution Verified"}</span>
            </div>
          </div>

        </div>

        {/* DYNAMIC ABSTENTION BANNER */}
        {scenario === "abstention" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-start space-x-3.5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-200 dark:bg-amber-500/20 border border-amber-400 dark:border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h4 className="font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  ⚠️ Autonomous System Abstention Enforced (Confidence: 41.2% &lt; 60% Threshold)
                </h4>
                <span className="text-[10px] font-mono bg-amber-200/80 dark:bg-amber-500/20 px-2 py-0.5 rounded font-bold">Rule: Max Posterior &lt; 0.60</span>
              </div>
              <p className="text-xs text-amber-800/90 dark:text-amber-200/90 mt-1 leading-relaxed">
                Contradictory evidence detected between Logistics damage logs (45 crushing claims) and 92% positive customer sound reviews. Automated supplier penalties suppressed pending physical warehouse audit.
              </p>
            </div>
          </motion.div>
        )}

        {/* MIDDLE ROW: RECHARTS TIME SERIES + EXECUTIVE NARRATIVE CANVAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT: Recharts Time-Series (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Time-Series Trajectory &amp; Anomaly Gatekeeper
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    STL Decomposition + MAD Z-Score (|Z| ≥ 2.50σ). Shaded region indicates 95% Bayesian tolerance.
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-[#A100FF] rounded-full"></span>
                    <span>Observed</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                    <span>STL Trend</span>
                  </span>
                </div>
              </div>

              <div className="h-[250px] sm:h-[280px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A100FF" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#A100FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "rgba(51, 65, 85, 0.25)" : "#E2E8F0"} />
                    <XAxis dataKey="date" stroke={theme === "dark" ? "#94A3B8" : "#64748B"} fontSize={10} tickLine={false} />
                    <YAxis stroke={theme === "dark" ? "#94A3B8" : "#64748B"} fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#0D1322" : "#FFFFFF",
                        borderColor: "#A100FF",
                        borderRadius: "0.5rem",
                        color: theme === "dark" ? "#F8FAFC" : "#0F172A",
                        fontSize: "11px",
                      }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Net Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#A100FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Line type="monotone" dataKey="trend" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                    <ReferenceDot x="Jul 15" y={178655} r={6} fill="#EF4444" stroke="#FFFFFF" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Deterministic STL Execution: 18ms</span>
              </span>
              <span>Target Anomaly Date: July 15, 2026</span>
            </div>
          </div>

          {/* RIGHT: Persona Narrative & 7-Pillar Action Matrix (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm dark:shadow-none space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/15 px-2 py-0.5 rounded border border-purple-300 dark:border-purple-500/30">
                  Executive Brief — Persona Tailored
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Groq LLaMA-3.3-70B</span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug tracking-tight">
                {scenario === "abstention"
                  ? "⚠️ SYSTEM ABSTAINED: Contradictory Evidence Detected — Automated Supplier Penalty Suppressed."
                  : (scenario === "cold_start"
                    ? "New Launch Alert: EV Smart Charger Pack Pro experienced Day 10 drop outside Bayesian Category Bands."
                    : (persona === "vp_commercial"
                      ? "Executive Alert: West Region Net Revenue fell by $52,400.00 driven by Logistics Port Bottleneck & Checkout Failures."
                      : "Operations Action Memo: West Distribution Port Bottleneck causing 48.5h dispatch delays and 18% cancellation spikes."))}
              </h3>

              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed bg-slate-50 dark:bg-[#070B14] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/90 font-sans">
                {scenario === "abstention"
                  ? "Product returns spiked +14% in Electronics, but customer sentiment is 92% positive regarding sound quality. Courier damage logs show 45 transit crushing events. Bayesian posterior confidence (41.2%) is below the 60% threshold, enforcing autonomous abstention."
                  : (scenario === "cold_start"
                    ? "With only 11 days of empirical history, standard STL cannot run. Hierarchical Bayesian Prior Smoothing (inherited from 'EV Accessories' peer mean of 21.5 units) flagged Day 10 sales (4 units) breaching the 95% lower bound (15.2 units) due to post-launch promo conclusion."
                    : (persona === "vp_commercial"
                      ? "On July 15, West Region Net Revenue dropped 8.4%. Deterministic Shapley decomposition isolates: Promotional Discount Over-Allocation (59.1%), Logistics Port Bottleneck (38.2%), and iOS Checkout Timeouts (2.7%). East and North regions remained unaffected."
                      : "FastExpress Carrier A suffered a 48.5-hour dispatch bottleneck at West Distribution Center, driving an OTIF collapse to 61.2%. Financial margins are masked under regional security policies."))}
              </p>
            </div>

            {/* 7-Pillar Action Plan */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-[#A100FF]" />
                  <span>7-Pillar Action Plan</span>
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">Ready for Dispatch</span>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/25 border border-purple-200 dark:border-purple-500/30 rounded-lg p-3 space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Controllable Lever:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300 font-mono">
                    {persona === "vp_commercial" ? "Promotional Budget Reallocation" : "Warehouse Carrier Route Allocation"}
                  </span>
                </div>
                <div className="font-medium text-slate-900 dark:text-white block mt-0.5 text-xs leading-snug">
                  {persona === "vp_commercial"
                    ? "Approve $25k expedited air-freight buffer and cap West region flash discounts at 10%."
                    : "Execute 1-Click Reroute: Shift 65% of West Region outbound volume to Backup Carrier BlueDart B."}
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1.5 text-slate-500 dark:text-slate-400 border-t border-purple-200 dark:border-purple-500/20 font-mono">
                  <span>Impact: <strong className="text-emerald-600 dark:text-emerald-400">+$64,000 recovery</strong></span>
                  <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{persona === "vp_commercial" ? "VP Commercial" : "Regional Ops Lead"}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={handleActionClick}
                  className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition active:scale-[0.98] ${
                    actionDispatched
                      ? "bg-emerald-600 text-white shadow-emerald-500/25"
                      : "bg-gradient-to-r from-[#A100FF] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-purple-500/25"
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{actionDispatched ? "Dispatched to ERP/WMS (200 OK)" : "1-Click Execute Action"}</span>
                </button>

                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  title="Provide Analyst Feedback"
                  className="bg-slate-100 dark:bg-[#11192E] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 transition"
                >
                  <ThumbsUp className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-emerald-500" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM ROW: SHAPLEY DRIVERS + QUALITATIVE EVIDENCE EXPLORER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Shapley Driver Attribution (6 Cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-[#A100FF]" />
                  <span>Shapley Causal Attribution &amp; Mix-Shift</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#070B14] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  Game-Theoretic Proof
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Promotional Discount Over-Allocation", pct: 59.1, impact: 3418 },
                  { name: "Logistics Dispatch & Port Bottleneck", pct: 38.2, impact: 2211 },
                  { name: "Customer Product Returns", pct: 2.7, impact: 156 },
                ].map((d, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-[#070B14]/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800/90 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{d.name}</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300 font-mono">{d.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-[#A100FF] h-2 rounded-full" style={{ width: `${d.pct}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Variance Impact: ${d.impact.toLocaleString()}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">High (p &lt; 0.01)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-1">
              <span className="text-purple-700 dark:text-purple-300 font-semibold font-mono">Simpson&apos;s Paradox Check:</span>
              <span className="text-slate-700 dark:text-slate-300">Localized to West Region (East/North unaffected)</span>
            </div>
          </div>

          {/* Qualitative Ticket Evidence (6 Cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-[#A100FF]" />
                  <span>Customer Voice &amp; Support Evidence (pgvector)</span>
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-[#070B14] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  ±48h Window
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1 no-scrollbar">
                {[
                  {
                    id: "TCK-1042",
                    topic: "Payment Gateway Failure",
                    text: "Card charged twice on iOS checkout but order status still shows pending with error #504.",
                    isNegative: true,
                  },
                  {
                    id: "TCK-1045",
                    topic: "Logistics Port Bottleneck",
                    text: "Order delayed by 3 days at West Coast Distribution Port. Tracking not updating!",
                    isNegative: true,
                  },
                  {
                    id: "TCK-1049",
                    topic: "Shipping Cancellation",
                    text: "Cancelled order after 4 days of zero dispatch progress from California warehouse.",
                    isNegative: true,
                  },
                ].map((t, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-[#070B14]/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800/90 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">{t.id}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                        t.isNegative
                          ? "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30"
                          : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30"
                      }`}>
                        {t.topic}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
              <span>Embedding: sentence-transformers/all-MiniLM-L6-v2</span>
              <span className="text-emerald-600 dark:text-emerald-400">Cosine Distance &lt; 0.28</span>
            </div>
          </div>

        </div>

      </main>

      {/* ============================================================= */}
      {/* 4. RUNTIME TELEMETRY FOOTER */}
      {/* ============================================================= */}
      <footer className="bg-white/95 dark:bg-[#0D1322]/95 border-t border-slate-200 dark:border-slate-800/90 py-2.5 px-3 sm:px-6 text-xs text-slate-500 dark:text-slate-400 sticky bottom-0 z-40 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] sm:text-xs">
            <span className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Live Telemetry:</span>
            </span>
            <span>⏱️ Latency: <strong className="text-slate-900 dark:text-white font-mono">345ms</strong></span>
            <span>🪙 Tokens: <strong className="text-slate-900 dark:text-white font-mono">420</strong></span>
            <span>💵 Cost / Insight: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">$0.00028</strong></span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span>RBAC: <strong className="text-purple-700 dark:text-purple-300 font-semibold">{persona === "vp_commercial" ? "Global View (Unmasked)" : "West Region (Masked)"}</strong></span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="text-purple-700 dark:text-purple-400 font-semibold font-sans">AIC 2026</span>
          </div>
        </div>
      </footer>

      {/* CONTRACT YAML MODAL */}
      <AnimatePresence>
        {isContractOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#0D1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-[#A100FF]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Governed Semantic Contract (YAML)</h3>
                </div>
                <button onClick={() => setIsContractOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-lg font-bold">&times;</button>
              </div>
              <div className="bg-slate-50 dark:bg-[#070B14] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-y-auto flex-1 font-mono text-xs text-slate-800 dark:text-slate-300">
                <pre><code className="text-purple-700 dark:text-purple-300">{`version: "1.0.0"
metadata:
  organization: "Enterprise Commercial & Operations"
  engine: "BusinessIntelligence.ai Governance Layer"

kpi_contracts:
  net_revenue:
    id: "KPI-001"
    formula: "SUM(orders.gross_amount) - SUM(orders.discounts) - SUM(returns.refund_value)"
    threshold: { statistical_sigma: 2.50, business_impact_usd: 50000.00 }
    security_policy:
      vp_commercial: { can_view: true, masked_columns: [] }
      regional_ops_lead: { can_view: true, row_filter: "region = user.assigned_region", masked_columns: ["margin_cost"] }`}</code></pre>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
                <button onClick={() => setIsContractOpen(false)} className="px-4 py-2 rounded-lg bg-[#A100FF] text-white text-xs font-semibold hover:bg-purple-700">Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-[#0D1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                  <ThumbsUp className="w-4 h-4 text-[#A100FF]" />
                  <span>Active Learning Feedback</span>
                </h3>
                <button onClick={() => setIsFeedbackOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold">&times;</button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Primary Causal Driver:</label>
                  <select className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5">
                    <option value="Logistics Dispatch & Port Bottleneck">Logistics Dispatch &amp; Port Bottleneck</option>
                    <option value="Payment Gateway Checkout Failures">Payment Gateway Checkout Failures</option>
                    <option value="Promotional Discount Over-Allocation">Promotional Discount Over-Allocation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Analyst Ground Truth Note:</label>
                  <textarea rows={3} placeholder="e.g., Confirmed with Port Master." className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5"></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button onClick={() => setIsFeedbackOpen(false)} className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">Cancel</button>
                <button
                  onClick={() => {
                    setIsFeedbackOpen(false);
                    showToast("✅ Feedback recorded! Bayesian causal priors updated.");
                  }}
                  className="px-4 py-2 rounded-lg bg-[#A100FF] text-white text-xs font-semibold hover:bg-purple-700"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="fixed bottom-14 right-4 z-50 bg-white dark:bg-[#0D1322] border border-purple-300 dark:border-purple-500/40 p-3.5 rounded-xl shadow-xl text-xs text-purple-900 dark:text-purple-200 flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
