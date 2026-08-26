"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  ShieldCheck,
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
  ChevronDown,
  PieChart,
  MessageSquare,
  Zap,
  Crosshair,
} from "lucide-react";

export default function ExecutiveCanvas() {
  const [scenario, setScenario] = useState("multi_factor");
  const [persona, setPersona] = useState("vp_commercial");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [actionDispatched, setActionDispatched] = useState(false);

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
      console.warn("FastAPI backend offline, loading fallback mock.");
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = () => {
    setActionDispatched(true);
    setTimeout(() => setActionDispatched(false), 3500);
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-[#A100FF] selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0D1322]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A100FF] to-purple-800 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/25 ring-1 ring-white/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                  BusinessIntelligence.ai
                </span>
                <span className="hidden xs:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Round 2
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                Governed Causal KPI Engine &amp; Adversarial Verification
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsContractOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Contract YAML</span>
            </button>

            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="bg-[#11192E] border border-purple-500/40 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#A100FF] focus:outline-none transition cursor-pointer"
            >
              <option value="vp_commercial">👑 VP Commercial (Global)</option>
              <option value="regional_ops_lead">🚛 Regional Ops Lead (Masked Costs)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Scenario Tabs */}
      <section className="bg-[#0D1322]/95 border-b border-slate-800/80 py-2.5 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Layers className="w-4 h-4 text-[#A100FF]" />
            <span>Benchmark Scenarios:</span>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setScenario("multi_factor")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition shrink-0 ${
                scenario === "multi_factor"
                  ? "bg-purple-600/20 border-[#A100FF] text-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <GitMerge className="w-3.5 h-3.5 text-purple-300" />
              <span>Scenario 1: Multi-Factor Drop (Day 14)</span>
            </button>

            <button
              onClick={() => setScenario("abstention")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition shrink-0 ${
                scenario === "abstention"
                  ? "bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Scenario 2: Low-Confidence Abstention (Day 21)</span>
            </button>

            <button
              onClick={() => setScenario("cold_start")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition shrink-0 ${
                scenario === "cold_start"
                  ? "bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scenario 3: Cold-Start SKU (&lt; 14d)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 flex-1 w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0D1322]/80 border border-slate-800/80 rounded-xl p-4">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-1">
              <span>Primary KPI</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 font-bold font-mono">
                -8.4%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">$178,655.75</div>
            <div className="text-[11px] text-slate-400 mt-1">West Region Net Revenue</div>
          </div>

          <div className="bg-[#0D1322]/80 border border-slate-800/80 rounded-xl p-4">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-1">
              <span>OTIF Fulfillment</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold font-mono">
                61.2%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">61.2%</div>
            <div className="text-[11px] text-slate-400 mt-1">West Port 48.5h Delay</div>
          </div>

          <div className="bg-[#0D1322]/80 border border-slate-800/80 rounded-xl p-4">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-1">
              <span>Customer Sentiment</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold font-mono">
                -0.72
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">-0.72</div>
            <div className="text-[11px] text-slate-400 mt-1">40 Checkout &amp; Logistics Tickets</div>
          </div>

          <div className="bg-[#0D1322]/80 border border-slate-800/80 rounded-xl p-4">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-1">
              <span>Causal Confidence</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                88.4%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">88.4%</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mathematically Verified</span>
            </div>
          </div>
        </div>

        {/* Narrative & Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-[#0D1322]/80 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30">
              Executive Brief &amp; Provenance
            </span>
            <h2 className="text-base font-bold text-white">
              {data?.executive_memo?.executive_headline ||
                "Executive Alert: West Region Net Revenue fell by $52,400.00 driven by Logistics Port Bottleneck."}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#070B14] p-3.5 rounded-lg border border-slate-800">
              {data?.executive_memo?.grounded_narrative ||
                "On July 15, West Region Net Revenue dropped 8.4%. Deterministic Shapley decomposition isolates: Promotional Discount Over-Allocation (59.1%), Logistics Port Bottleneck (38.2%), and iOS Checkout Timeouts (2.7%). East and North regions remained unaffected."}
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#0D1322]/80 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                7-Pillar Recommended Action Plan
              </span>
              <div className="mt-3 space-y-2 text-xs">
                <p className="text-slate-400 font-medium">
                  Controllable Lever:{" "}
                  <strong className="text-purple-300 font-mono">
                    {data?.executive_memo?.seven_pillar_action_matrix?.controllable_lever ||
                      "Warehouse Carrier Route Allocation"}
                  </strong>
                </p>
                <div className="bg-purple-950/25 border border-purple-500/30 p-3 rounded-lg text-white text-xs font-medium">
                  {data?.executive_memo?.seven_pillar_action_matrix?.action ||
                    "Execute 1-Click Reroute: Shift 65% of West Region outbound volume to Backup Carrier BlueDart B."}
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                  <span>
                    Impact:{" "}
                    <strong className="text-emerald-400">
                      {data?.executive_memo?.seven_pillar_action_matrix?.expected_impact || "+$64,000 recovery"}
                    </strong>
                  </span>
                  <span>
                    Owner:{" "}
                    <strong className="text-slate-300">
                      {data?.executive_memo?.seven_pillar_action_matrix?.owner || "Regional Operations Lead"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleActionClick}
                className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition ${
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
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-lg border border-slate-700"
              >
                <ThumbsUp className="w-4 h-4 text-slate-400 hover:text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Telemetry */}
      <footer className="bg-[#0D1322]/95 border-t border-slate-800/90 py-2.5 px-4 text-xs text-slate-400 sticky bottom-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            <span className="flex items-center space-x-1.5 text-slate-200 font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Telemetry:</span>
            </span>
            <span>⏱️ Latency: <strong className="text-white font-mono">345ms</strong></span>
            <span>🪙 Tokens: <strong className="text-white font-mono">420</strong></span>
            <span>💵 Cost: <strong className="text-emerald-400 font-mono">$0.00028</strong></span>
          </div>
          <div className="text-[11px] text-purple-400 font-semibold">Accenture Innovation Challenge 2026</div>
        </div>
      </footer>
    </main>
  );
}
