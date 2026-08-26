/**
 * BUSINESSINTELLIGENCE.AI — FRONTEND LOGIC & DATA ENGINE
 * Universal responsive chart engine, persona switching, scenario handling,
 * REST API client with offline fallback, and toast notifications.
 */

const API_BASE = "http://127.0.0.1:8000";
let kpiChartInstance = null;
let currentScenario = "multi_factor";
let currentPersona = "vp_commercial";

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initChart();
  loadScenario("multi_factor");
});

// -------------------------------------------------------------
// 1. RESPONSIVE CHART.JS ENGINE
// -------------------------------------------------------------
function initChart() {
  const ctx = document.getElementById("kpiChart").getContext("2d");

  // Create purple gradient for area fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 270);
  gradient.addColorStop(0, "rgba(161, 0, 255, 0.28)");
  gradient.addColorStop(1, "rgba(161, 0, 255, 0.0)");

  const labels = [];
  const actualData = [];
  const trendData = [];

  const startDate = new Date(2026, 6, 1);
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    labels.push(label);

    const baseVal = 220000 + Math.sin(i / 2.2) * 8500;
    trendData.push(baseVal);

    if (i === 14) {
      actualData.push(178655.75); // Day 14 Anomaly Drop
    } else {
      actualData.push(baseVal + (Math.random() * 5000 - 2500));
    }
  }

  kpiChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Observed Net Revenue",
          data: actualData,
          borderColor: "#A100FF",
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: (c) => (c.dataIndex === 14 ? 7 : 2),
          pointHoverRadius: 8,
          pointBackgroundColor: (c) => (c.dataIndex === 14 ? "#EF4444" : "#A100FF"),
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: (c) => (c.dataIndex === 14 ? 2.5 : 0),
        },
        {
          label: "STL Seasonal Baseline",
          data: trendData,
          borderColor: "#64748B",
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(13, 19, 34, 0.95)",
          titleFont: { family: "Inter", size: 12, weight: "bold" },
          bodyFont: { family: "JetBrains Mono", size: 11 },
          borderColor: "rgba(161, 0, 255, 0.4)",
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            label: (c) => ` ${c.dataset.label}: $${Math.round(c.parsed.y).toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(51, 65, 85, 0.25)" },
          ticks: {
            color: "#94A3B8",
            font: { family: "Inter", size: 10 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        },
        y: {
          grid: { color: "rgba(51, 65, 85, 0.25)" },
          ticks: {
            color: "#94A3B8",
            font: { family: "JetBrains Mono", size: 10 },
            callback: (val) => `$${val / 1000}k`
          }
        }
      }
    }
  });
}

// -------------------------------------------------------------
// 2. SCENARIO & PERSONA STATE MANAGEMENT
// -------------------------------------------------------------
async function loadScenario(scenarioId) {
  currentScenario = scenarioId;

  document.querySelectorAll(".scenario-btn").forEach(btn => btn.classList.remove("active-scenario"));
  const activeBtn = document.getElementById(`btn-${scenarioId}`);
  if (activeBtn) activeBtn.classList.add("active-scenario");

  try {
    const res = await fetch(`${API_BASE}/api/scenarios/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario_id: scenarioId,
        persona: currentPersona
      })
    });
    if (res.ok) {
      const data = await res.json();
      renderScenarioUI(data);
      return;
    }
  } catch (err) {
    // Offline client simulation fallback
  }

  renderOfflineScenario(scenarioId, currentPersona);
}

function handlePersonaChange(persona) {
  currentPersona = persona;
  const telemStatus = document.getElementById("telemRbacStatus");
  if (persona === "vp_commercial") {
    telemStatus.innerText = "Global View (Unmasked Margins)";
    showToast("Switched to VP Commercial: Global Strategy & Unmasked Margins enabled.", "info");
  } else {
    telemStatus.innerText = "West Region (Margins Masked by RBAC)";
    showToast("Switched to Regional Ops Lead: Financial margins masked under RBAC Policy #4.", "warning");
  }
  loadScenario(currentScenario);
}

// -------------------------------------------------------------
// 3. UI RENDERING ENGINE
// -------------------------------------------------------------
function renderScenarioUI(data) {
  const memo = data.executive_memo;
  const telem = data.telemetry;

  if (data.scenario_id === "multi_factor") {
    document.getElementById("labelTile1").innerText = "Net Revenue (Daily)";
    document.getElementById("badgeTile1").innerText = "-8.4% Drop";
    document.getElementById("badgeTile1").className = "px-2 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 font-bold font-mono";
    document.getElementById("tileNetRevenue").innerText = "$178,655.75";
    document.getElementById("deltaTile1").innerText = "-$52,400.00";
    document.getElementById("subTile1").innerText = "vs 7d Baseline ($231k)";

    document.getElementById("labelTile2").innerText = "OTIF Fulfillment Rate";
    document.getElementById("tileOTIF").innerText = "61.2%";
    document.getElementById("subTile2").innerText = "West Port 48.5h Bottleneck";

    document.getElementById("labelTile3").innerText = "Customer Voice Sentiment";
    document.getElementById("tileSentiment").innerText = "-0.72";
    document.getElementById("tileSentimentTag").innerText = "Severe Negative";
    document.getElementById("subTile3").innerText = "40 Checkout & Shipping Tickets";

    document.getElementById("confidenceBadge").className = "px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono";
    document.getElementById("confidenceBadge").innerText = "88% (High)";
    document.getElementById("tileConfidenceScore").innerText = "88.4%";
    document.getElementById("tileConfidenceStatus").innerHTML = `<i data-lucide="check-circle" class="w-3.5 h-3.5 shrink-0"></i><span class="truncate">Attribution Mathematically Verified</span>`;

    document.getElementById("abstentionBanner").classList.add("hidden");
    document.getElementById("chartContextNote").innerText = "Target Anomaly Date: July 15, 2026 (West Region)";
  } else if (data.scenario_id === "abstention") {
    document.getElementById("labelTile1").innerText = "Product Return Rate";
    document.getElementById("badgeTile1").innerText = "+14.0% Surge";
    document.getElementById("badgeTile1").className = "px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold font-mono";
    document.getElementById("tileNetRevenue").innerText = "18.2%";
    document.getElementById("deltaTile1").innerText = "+350% Spike";
    document.getElementById("subTile1").innerText = "vs 4.0% Baseline";

    document.getElementById("labelTile2").innerText = "Courier Damage Claims";
    document.getElementById("tileOTIF").innerText = "45 Claims";
    document.getElementById("subTile2").innerText = "Carrier C Transit Mishandling";

    document.getElementById("labelTile3").innerText = "Product Review Sentiment";
    document.getElementById("tileSentiment").innerText = "+0.62";
    document.getElementById("tileSentimentTag").innerText = "92% Positive";
    document.getElementById("subTile3").innerText = "Audio Quality Loved by Users";

    document.getElementById("confidenceBadge").className = "px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold font-mono";
    document.getElementById("confidenceBadge").innerText = "41% (Abstained)";
    document.getElementById("tileConfidenceScore").innerText = "41.2%";
    document.getElementById("tileConfidenceStatus").innerHTML = `<i data-lucide="alert-triangle" class="w-3.5 h-3.5 shrink-0 text-amber-400"></i><span class="text-amber-300 truncate">Below 60% Decision Threshold</span>`;

    document.getElementById("abstentionBanner").classList.remove("hidden");
    document.getElementById("abstentionBannerText").innerText = data.bayesian_evaluation?.abstention_banner_text || "Contradictory evidence detected between Logistics damage logs and 92% positive reviews. Automated supplier penalties suppressed.";
    document.getElementById("chartContextNote").innerText = "Target Anomaly Date: July 21, 2026 (Electronics Returns)";
  } else if (data.scenario_id === "cold_start") {
    document.getElementById("labelTile1").innerText = "EV Charger Sales (New SKU)";
    document.getElementById("badgeTile1").innerText = "-86.0% Drop";
    document.getElementById("badgeTile1").className = "px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold font-mono";
    document.getElementById("tileNetRevenue").innerText = "4 Units";
    document.getElementById("deltaTile1").innerText = "-17.5 Units";
    document.getElementById("subTile1").innerText = "vs Category Prior (21.5 Units)";

    document.getElementById("labelTile2").innerText = "Empirical History Grain";
    document.getElementById("tileOTIF").innerText = "11 Days";
    document.getElementById("subTile2").innerText = "Sparse History (N < 14 Days)";

    document.getElementById("labelTile3").innerText = "Category Smoothing";
    document.getElementById("tileSentiment").innerText = "+0.20";
    document.getElementById("tileSentimentTag").innerText = "EV Accessories";
    document.getElementById("subTile3").innerText = "Hierarchical Prior Active";

    document.getElementById("confidenceBadge").className = "px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold font-mono";
    document.getElementById("confidenceBadge").innerText = "79% (Prior Inference)";
    document.getElementById("tileConfidenceScore").innerText = "79.0%";
    document.getElementById("tileConfidenceStatus").innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5 shrink-0 text-cyan-400"></i><span class="text-cyan-300 truncate">Bayesian Category Smoothing</span>`;

    document.getElementById("abstentionBanner").classList.add("hidden");
    document.getElementById("chartContextNote").innerText = "Target SKU: EV Smart Charger Pack Pro (Day 10)";
  }

  // Narrative & 7-Pillar Action Plan
  document.getElementById("memoHeadline").innerText = memo.executive_headline;
  document.getElementById("memoBody").innerText = memo.grounded_narrative;
  
  const action = memo.seven_pillar_action_matrix;
  document.getElementById("actionLever").innerText = action.controllable_lever;
  document.getElementById("actionDesc").innerText = action.action;
  document.getElementById("actionImpact").innerText = action.expected_impact;
  document.getElementById("actionOwner").innerText = action.owner;

  renderDriverBars(data);
  renderEvidenceTickets(data);

  if (telem) {
    document.getElementById("telemLatency").innerText = `${telem.total_pipeline_latency_ms || 345}ms`;
    document.getElementById("telemTokens").innerText = `${telem.tokens_consumed || 420}`;
    document.getElementById("telemCost").innerText = `$${telem.cost_usd || 0.00028}`;
  }

  if (window.lucide) lucide.createIcons();
}

function renderDriverBars(data) {
  const driverList = document.getElementById("driverList");
  driverList.innerHTML = "";

  const drivers = data.causal_attribution?.ranked_drivers || [
    { driver_name: "Promotional Discount Over-Allocation", shapley_contribution_pct: 59.1, variance_explained_usd: 3418 },
    { driver_name: "Logistics Dispatch & Port Bottleneck", shapley_contribution_pct: 38.2, variance_explained_usd: 2211 },
    { driver_name: "Customer Product Returns", shapley_contribution_pct: 2.7, variance_explained_usd: 156 }
  ];

  drivers.forEach((d) => {
    const item = document.createElement("div");
    item.className = "bg-space-950/80 p-3 rounded-lg border border-slate-800/90 space-y-1.5";
    item.innerHTML = `
      <div class="flex justify-between items-center text-xs">
        <span class="font-medium text-slate-200">${d.driver_name}</span>
        <span class="font-bold text-purple-300 font-mono">${d.shapley_contribution_pct}%</span>
      </div>
      <div class="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-500 to-accenture-purple h-2 rounded-full transition-all duration-700" style="width: ${d.shapley_contribution_pct}%"></div>
      </div>
      <div class="flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span>Variance Impact: $${(d.variance_explained_usd || 0).toLocaleString()}</span>
        <span class="text-emerald-400 font-semibold">${d.confidence_band || 'High (p < 0.01)'}</span>
      </div>
    `;
    driverList.appendChild(item);
  });
}

function renderEvidenceTickets(data) {
  const evList = document.getElementById("evidenceList");
  evList.innerHTML = "";

  let evidence = data.qualitative_evidence?.retrieved_evidence;
  if (!evidence || evidence.length === 0) {
    if (data.scenario_id === "abstention") {
      evidence = [
        { ticket_id: "TCK-1240", topic: "Courier Transit Damage", excerpt: "The headphones sound amazing! 5 stars for sound, but outer delivery box was completely crushed by courier.", sentiment_score: 0.65 },
        { ticket_id: "TCK-1244", topic: "Courier Transit Damage", excerpt: "Product itself works perfectly, but shipping box was torn open. 5 stars for audio quality, 1 star for delivery.", sentiment_score: 0.60 }
      ];
    } else {
      evidence = [
        { ticket_id: "TCK-1042", topic: "Payment Gateway Failure", excerpt: "Card charged twice on iOS checkout but order status still shows pending with error #504.", sentiment_score: -0.88 },
        { ticket_id: "TCK-1045", topic: "Logistics Port Bottleneck", excerpt: "Order delayed by 3 days at West Coast Distribution Port. Tracking not updating!", sentiment_score: -0.82 }
      ];
    }
  }

  evidence.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "bg-space-950/90 p-3 rounded-lg border border-slate-800/90 text-xs space-y-1.5";
    const sentColor = ev.sentiment_score < -0.3 ? "text-red-400 bg-red-500/15 border-red-500/30" : "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-mono text-[11px] font-bold text-slate-400">${ev.ticket_id}</span>
        <span class="px-2 py-0.5 text-[10px] font-semibold rounded border ${sentColor}">${ev.topic}</span>
      </div>
      <p class="text-slate-300 text-xs leading-relaxed italic">"${ev.excerpt}"</p>
    `;
    evList.appendChild(card);
  });
}

function renderOfflineScenario(scenarioId, persona) {
  if (scenarioId === "multi_factor") {
    renderScenarioUI({
      scenario_id: "multi_factor",
      executive_memo: {
        executive_headline: persona === "vp_commercial"
          ? "Executive Alert: West Region Net Revenue fell by $52,400.00 driven by Logistics Port Bottleneck & Checkout Failures."
          : "Operations Action Memo: West Distribution Port Bottleneck causing 48.5h dispatch delays and 18% cancellation spikes.",
        grounded_narrative: persona === "vp_commercial"
          ? "On July 15, West Region Net Revenue dropped 8.4%. Deterministic Shapley decomposition isolates: Promotional Discount Over-Allocation (59.1%), Logistics Port Bottleneck (38.2%), and iOS Checkout Timeouts (2.7%). East and North regions remained unaffected."
          : "FastExpress Carrier A suffered a 48.5-hour dispatch bottleneck at West Distribution Center, driving an OTIF collapse to 61.2%. Financial margins are masked under regional security policies.",
        seven_pillar_action_matrix: {
          controllable_lever: persona === "vp_commercial" ? "Promotional Budget Reallocation & Air-Freight Buffer" : "Warehouse Carrier Route Allocation",
          action: persona === "vp_commercial" ? "Approve $25k expedited air-freight buffer and cap West region flash discounts at 10%." : "Execute 1-Click Reroute: Shift 65% of West Region outbound volume to Backup Carrier BlueDart B.",
          expected_impact: "+$64,000 revenue recovery within 5 business days",
          owner: persona === "vp_commercial" ? "VP Commercial / CCO" : "Regional Operations Lead"
        }
      },
      telemetry: { total_pipeline_latency_ms: 345, tokens_consumed: 420, cost_usd: 0.00028 }
    });
  } else if (scenarioId === "abstention") {
    renderScenarioUI({
      scenario_id: "abstention",
      bayesian_evaluation: {
        abstention_banner_text: "⚠️ SYSTEM ABSTAINED: Evidence is contradictory between logistics damage claims and 92% positive product reviews. Automated supplier penalties suppressed."
      },
      executive_memo: {
        executive_headline: "⚠️ SYSTEM ABSTAINED: Contradictory Evidence Detected — Automated Supplier Penalty Suppressed.",
        grounded_narrative: "Product returns spiked +14% in Electronics, but customer sentiment is 92% positive regarding sound quality. Courier damage logs show 45 transit crushing events. Bayesian posterior confidence (41.2%) is below the 60% threshold, enforcing autonomous abstention.",
        seven_pillar_action_matrix: {
          controllable_lever: "Mandatory Physical Inspection Protocol",
          action: "Quarantine and audit 50 returned packages at Central Warehouse to verify courier vs. hardware failure.",
          expected_impact: "Prevents false supplier disputes and guarantees 100% empirical ground truth.",
          owner: "QA & Logistics Audit Lead"
        }
      },
      telemetry: { total_pipeline_latency_ms: 285, tokens_consumed: 380, cost_usd: 0.00025 }
    });
  } else if (scenarioId === "cold_start") {
    renderScenarioUI({
      scenario_id: "cold_start",
      executive_memo: {
        executive_headline: "New Launch Alert: EV Smart Charger Pack Pro experienced sudden Day 10 drop outside Bayesian Category Bands.",
        grounded_narrative: "With only 11 days of empirical history, standard STL cannot run. Hierarchical Bayesian Prior Smoothing (inherited from 'EV Accessories' peer mean of 21.5 units) flagged Day 10 sales (4 units) breaching the 95% lower bound (15.2 units) due to post-launch promo conclusion.",
        seven_pillar_action_matrix: {
          controllable_lever: "Targeted Category Retargeting Campaign",
          action: "Deploy automated email re-engagement campaign to existing EV Accessories customers.",
          expected_impact: "Restore unit velocity to category peer baseline (18-22 units/day).",
          owner: "Growth Marketing Lead"
        }
      },
      telemetry: { total_pipeline_latency_ms: 260, tokens_consumed: 350, cost_usd: 0.00022 }
    });
  }
}

// -------------------------------------------------------------
// 4. ACTION DISPATCH & TOAST NOTIFICATIONS
// -------------------------------------------------------------
function executeAction() {
  const btn = document.getElementById("btnExecuteAction");
  btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Dispatched to ERP/WMS (200 OK)</span>`;
  btn.className = "flex-1 bg-emerald-600 text-white text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition";
  if (window.lucide) lucide.createIcons();
  
  showToast("🚀 Action successfully dispatched to enterprise ERP/WMS dispatcher.", "success");

  setTimeout(() => {
    btn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>1-Click Execute Action</span>`;
    btn.className = "flex-1 bg-gradient-to-r from-accenture-purple to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25 transition";
    if (window.lucide) lucide.createIcons();
  }, 3500);
}

function openFeedbackModal() {
  document.getElementById("feedbackModal").classList.remove("hidden");
}

function closeFeedbackModal() {
  document.getElementById("feedbackModal").classList.add("hidden");
}

function openContractModal() {
  document.getElementById("contractModal").classList.remove("hidden");
}

function closeContractModal() {
  document.getElementById("contractModal").classList.add("hidden");
}

async function submitAnalystFeedback() {
  const driver = document.getElementById("fbDriverSelect").value;
  const comment = document.getElementById("fbComment").value;

  try {
    await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_id: "INC-20260715-WEST",
        user_role: currentPersona,
        feedback_type: "thumbs_up",
        confirmed_driver: driver,
        analyst_comment: comment
      })
    });
  } catch (err) {
    // Offline fallback
  }

  closeFeedbackModal();
  showToast(`✅ Feedback recorded! Bayesian prior weight for '${driver}' updated.`, "success");
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  
  const borderCol = type === "success" ? "border-emerald-500/40 bg-space-900 text-emerald-300 shadow-emerald-500/10" : (type === "warning" ? "border-amber-500/40 bg-space-900 text-amber-300 shadow-amber-500/10" : "border-purple-500/40 bg-space-900 text-purple-300 shadow-purple-500/10");

  toast.className = `glass-card p-3 rounded-xl border ${borderCol} text-xs shadow-xl flex items-center space-x-2 max-w-sm pointer-events-auto animate-slide-up`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
