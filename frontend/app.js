const API_BASE = "http://127.0.0.1:8000";
let kpiChartInstance = null;
let currentScenario = "multi_factor";
let currentPersona = "vp_commercial";
let currentTheme = "dark";

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  initChart();
  loadScenario("multi_factor");
});

// ── Chart Initialisation ─────────────────────────────────────
function initChart() {
  const ctx = document.getElementById("kpiChart").getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, 250);
  grad.addColorStop(0, "rgba(124,58,237,0.28)");
  grad.addColorStop(1, "rgba(124,58,237,0.01)");

  const labels = [], actual = [], trend = [];
  const start = new Date(2026, 6, 1);

  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

    const base = 220000 + Math.sin(i / 2.2) * 8500;
    trend.push(base);
    actual.push(i === 14 ? 178655.75 : base + (Math.random() * 5000 - 2500));
  }

  kpiChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Net Revenue",
          data: actual,
          borderColor: "#7C3AED",
          backgroundColor: grad,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: (c) => (c.dataIndex === 14 ? 6 : 0),
          pointHoverRadius: 7,
          pointBackgroundColor: (c) => (c.dataIndex === 14 ? "#EF4444" : "#7C3AED"),
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Trend Baseline",
          data: trend,
          borderColor: "#64748B",
          borderDash: [4, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(17,24,39,0.96)",
          titleFont: { family: "Inter", size: 11, weight: "bold" },
          bodyFont: { family: "JetBrains Mono", size: 10 },
          borderColor: "rgba(124,58,237,0.35)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (c) => ` ${c.dataset.label}: $${Math.round(c.parsed.y).toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(71,85,105,0.20)" },
          ticks: { color: "#64748B", font: { family: "Inter", size: 10 }, maxTicksLimit: 8 }
        },
        y: {
          grid: { color: "rgba(71,85,105,0.20)" },
          ticks: {
            color: "#64748B",
            font: { family: "JetBrains Mono", size: 10 },
            callback: (v) => `$${(v / 1000).toFixed(0)}k`
          }
        }
      }
    }
  });
}

// ── Scenario & Persona Loading ───────────────────────────────
async function loadScenario(scenarioId) {
  currentScenario = scenarioId;

  document.querySelectorAll(".scenario-btn").forEach(b => b.classList.remove("active-scenario"));
  const active = document.getElementById(`btn-${scenarioId}`);
  if (active) active.classList.add("active-scenario");

  try {
    const res = await fetch(`${API_BASE}/api/scenarios/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario_id: scenarioId, persona: currentPersona })
    });
    if (res.ok) { renderScenarioUI(await res.json()); return; }
  } catch (_) {}

  renderOfflineScenario(scenarioId, currentPersona);
}

// ── Persona Custom Dropdown Handlers ──────────────────────────
function togglePersonaMenu(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const dd = document.getElementById("personaDropdown");
  const menu = document.getElementById("personaMenu");
  if (!menu || !dd) return;
  
  const isHidden = menu.style.display === "none" || menu.style.display === "";
  menu.style.display = isHidden ? "block" : "none";
  dd.classList.toggle("open", isHidden);
}

function selectPersona(value, label, e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  currentPersona = value;
  const labelEl = document.getElementById("personaBtnLabel");
  if (labelEl) labelEl.textContent = label;

  const menu = document.getElementById("personaMenu");
  if (menu) menu.style.display = "none";
  const dd = document.getElementById("personaDropdown");
  if (dd) dd.classList.remove("open");

  const status = document.getElementById("telemRbacStatus");
  if (status) {
    if (value === "vp_commercial") {
      status.textContent = "Global View";
      showToast("Switched to VP Commercial — full margins visible.", "info");
    } else {
      status.textContent = "West Region (Masked)";
      showToast("Switched to Regional Ops Lead — margin columns masked by RBAC.", "warning");
    }
  }
  loadScenario(currentScenario);
}

// Close dropdown when clicking anywhere outside it
document.addEventListener("click", (e) => {
  const dd = document.getElementById("personaDropdown");
  if (dd && !dd.contains(e.target)) {
    const menu = document.getElementById("personaMenu");
    if (menu) menu.style.display = "none";
    dd.classList.remove("open");
  }
});

// ── UI Rendering ─────────────────────────────────────────────
function renderScenarioUI(data) {
  const memo = data.executive_memo || {};
  const telem = data.telemetry || {};

  if (data.scenario_id === "multi_factor") {
    setTile("labelTile1", "Net Revenue (Daily)");
    setBadge("badgeTile1", "−8.4%", "badge-red");
    document.getElementById("tileNetRevenue").textContent = "$178,655";
    document.getElementById("deltaTile1").textContent = "−$52,400";
    document.getElementById("subTile1").textContent = "vs 7-day baseline ($231k)";

    setTile("labelTile2", "OTIF Fulfillment");
    setBadge("badgeTile2", "Degraded", "badge-amber");
    document.getElementById("tileOTIF").textContent = "61.2%";
    document.getElementById("subTile2").textContent = "West Port 48.5h Bottleneck";

    setTile("labelTile3", "Customer Sentiment");
    setBadge("tileSentimentTag", "Severe Neg.", "badge-purple");
    document.getElementById("tileSentiment").textContent = "−0.72";
    document.getElementById("subTile3").textContent = "40 checkout & shipping tickets";

    setBadge("confidenceBadge", "88% High", "badge-green");
    document.getElementById("tileConfidenceScore").textContent = "88.4%";
    setConfStatus("check-circle", "#10B981", "Attribution verified");

    hideAbstention();
    document.getElementById("chartContextNote").textContent = "Target: July 15, 2026 — West Region";

  } else if (data.scenario_id === "abstention") {
    setTile("labelTile1", "Product Return Rate");
    setBadge("badgeTile1", "+14.0%", "badge-amber");
    document.getElementById("tileNetRevenue").textContent = "18.2%";
    document.getElementById("deltaTile1").textContent = "+350% Spike";
    document.getElementById("subTile1").textContent = "vs 4.0% baseline";

    setTile("labelTile2", "Courier Damage Claims");
    setBadge("badgeTile2", "45 Claims", "badge-red");
    document.getElementById("tileOTIF").textContent = "45";
    document.getElementById("subTile2").textContent = "Carrier C Transit Mishandling";

    setTile("labelTile3", "Product Review Score");
    setBadge("tileSentimentTag", "92% Positive", "badge-green");
    document.getElementById("tileSentiment").textContent = "+0.62";
    document.getElementById("subTile3").textContent = "Audio quality loved by users";

    setBadge("confidenceBadge", "41% — Abstained", "badge-amber");
    document.getElementById("tileConfidenceScore").textContent = "41.2%";
    setConfStatus("alert-triangle", "#F59E0B", "Below 60% threshold");

    showAbstention(data.bayesian_evaluation?.abstention_banner_text || "Contradictory evidence detected. Automated penalties suppressed.");
    document.getElementById("chartContextNote").textContent = "Target: July 21, 2026 — Electronics Returns";

  } else if (data.scenario_id === "cold_start") {
    setTile("labelTile1", "EV Charger Units (Day 10)");
    setBadge("badgeTile1", "−86.0%", "badge-cyan");
    document.getElementById("tileNetRevenue").textContent = "4 Units";
    document.getElementById("deltaTile1").textContent = "−17.5 Units";
    document.getElementById("subTile1").textContent = "vs category prior (21.5 units)";

    setTile("labelTile2", "Empirical History");
    setBadge("badgeTile2", "Sparse (N<14)", "badge-cyan");
    document.getElementById("tileOTIF").textContent = "11 Days";
    document.getElementById("subTile2").textContent = "Hierarchical Bayesian applied";

    setTile("labelTile3", "Category Smoothing");
    setBadge("tileSentimentTag", "EV Accessories", "badge-cyan");
    document.getElementById("tileSentiment").textContent = "+0.20";
    document.getElementById("subTile3").textContent = "Prior active — peer mean 21.5";

    setBadge("confidenceBadge", "79% Prior", "badge-purple");
    document.getElementById("tileConfidenceScore").textContent = "79.0%";
    setConfStatus("sparkles", "#06B6D4", "Bayesian prior smoothing");

    hideAbstention();
    document.getElementById("chartContextNote").textContent = "SKU: EV Smart Charger Pack Pro — Day 10";
  }

  // Narrative
  document.getElementById("memoHeadline").textContent = memo.executive_headline || "";
  document.getElementById("memoBody").textContent = memo.grounded_narrative || "";

  const action = memo.seven_pillar_action_matrix || {};
  document.getElementById("actionLever").textContent = action.controllable_lever || "";
  document.getElementById("actionDesc").textContent = action.action || "";
  document.getElementById("actionImpact").textContent = action.expected_impact || "";
  document.getElementById("actionOwner").textContent = action.owner || "";

  renderDriverBars(data);
  renderEvidenceTickets(data);

  if (telem.total_pipeline_latency_ms) {
    document.getElementById("telemLatency").textContent = `${telem.total_pipeline_latency_ms}ms`;
    document.getElementById("telemTokens").textContent = `${telem.tokens_consumed || 420}`;
    document.getElementById("telemCost").textContent = `$${telem.cost_usd || 0.00028}`;
  }

  if (window.lucide) lucide.createIcons();
}

function setTile(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setBadge(id, text, cls) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.className = `badge ${cls}`;
  }
}

function setConfStatus(icon, iconColor, label) {
  const el = document.getElementById("tileConfidenceStatus");
  if (el) {
    el.innerHTML = `<i data-lucide="${icon}" style="width:12px;height:12px;color:${iconColor};flex-shrink:0;"></i>
     <span style="color:${iconColor};font-weight:600;">${label}</span>`;
  }
}

function showAbstention(text) {
  const el = document.getElementById("abstentionBanner");
  if (el) {
    el.style.display = "block";
    document.getElementById("abstentionBannerText").textContent = text;
  }
}

function hideAbstention() {
  const el = document.getElementById("abstentionBanner");
  if (el) el.style.display = "none";
}

// ── Shapley Driver (SCA) Progress Bars ───────────────────────
function renderDriverBars(data) {
  const list = document.getElementById("driverList");
  if (!list) return;
  list.innerHTML = "";

  const drivers = data.causal_attribution?.ranked_drivers || [
    { driver_name: "Promotional Discount Over-Allocation", shapley_contribution_pct: 59.1, variance_explained_usd: 3418, confidence_band: "High (p < 0.01)" },
    { driver_name: "Logistics Dispatch & Port Bottleneck",  shapley_contribution_pct: 38.2, variance_explained_usd: 2211, confidence_band: "High (p < 0.01)" },
    { driver_name: "Customer Product Returns",              shapley_contribution_pct: 2.7,  variance_explained_usd: 156,  confidence_band: "Moderate" }
  ];

  drivers.forEach(d => {
    const item = document.createElement("div");
    item.style.cssText = "display:flex;flex-direction:column;gap:6px;";
    item.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
        <span style="color:var(--text-1);font-weight:600;">${d.driver_name}</span>
        <span style="color:var(--purple-light);font-weight:700;font-family:'JetBrains Mono',monospace;font-size:13px;">${d.shapley_contribution_pct}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${d.shapley_contribution_pct}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);font-family:'JetBrains Mono',monospace;font-weight:500;">
        <span>Variance: $${(d.variance_explained_usd || 0).toLocaleString()}</span>
        <span style="color:#10B981;font-weight:600;">${d.confidence_band || "High"}</span>
      </div>
    `;
    list.appendChild(item);
  });
}

// ── Customer Evidence Tickets ────────────────────────────────
function renderEvidenceTickets(data) {
  const list = document.getElementById("evidenceList");
  if (!list) return;
  list.innerHTML = "";

  let evidence = data.qualitative_evidence?.retrieved_evidence;
  if (!evidence || evidence.length === 0) {
    evidence = data.scenario_id === "abstention"
      ? [
          { ticket_id: "TCK-1240", topic: "Courier Transit Damage", excerpt: "Sound quality is amazing but the delivery box was completely crushed by courier.", sentiment_score: 0.65 },
          { ticket_id: "TCK-1244", topic: "Courier Transit Damage", excerpt: "Product works perfectly — 5 stars for audio. Outer packaging was torn open on arrival.", sentiment_score: 0.60 }
        ]
      : [
          { ticket_id: "TCK-1042", topic: "Payment Gateway Failure", excerpt: "Card charged twice on iOS checkout but order still shows pending with error #504.", sentiment_score: -0.88 },
          { ticket_id: "TCK-1045", topic: "Logistics Bottleneck",   excerpt: "Order delayed 3 days at West Coast Distribution Port. Tracking not updating.", sentiment_score: -0.82 }
        ];
  }

  evidence.forEach(ev => {
    const isNeg = ev.sentiment_score < -0.3;
    const card = document.createElement("div");
    card.className = "evidence-card";
    card.style.cssText = `
      background:var(--bg-raised);
      border:1px solid var(--border);
      border-radius:8px;
      padding:12px;
      display:flex;
      flex-direction:column;
      gap:6px;
      flex-shrink:0;
    `;
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:11px;color:var(--text-3);font-family:'JetBrains Mono',monospace;font-weight:700;">${ev.ticket_id}</span>
        <span class="badge ${isNeg ? "badge-red" : "badge-green"}">${ev.topic}</span>
      </div>
      <p class="evidence-excerpt" style="font-size:11px;color:var(--text-2);line-height:1.55;margin:0;font-style:italic;font-weight:500;">"${ev.excerpt}"</p>
    `;
    list.appendChild(card);
  });
}

// ── Offline Fallback ─────────────────────────────────────────
function renderOfflineScenario(scenarioId, persona) {
  const vp = persona === "vp_commercial";

  const memos = {
    multi_factor: {
      executive_headline: vp
        ? "Executive Alert: West Region Net Revenue fell by $52,400 driven by Logistics Port Bottleneck & Checkout Failures."
        : "Ops Memo: West Distribution Port Bottleneck causing 48.5h dispatch delays and 18% cancellation spikes.",
      grounded_narrative: vp
        ? "July 15 — West Region dropped 8.4%. Shapley decomposition: Promotional Discount Over-Allocation (59.1%), Logistics Port Bottleneck (38.2%), iOS Checkout Timeouts (2.7%). East and North unaffected."
        : "FastExpress Carrier A suffered a 48.5h bottleneck at West DC, driving OTIF collapse to 61.2%. Financial margins are masked under regional RBAC policy.",
      seven_pillar_action_matrix: {
        controllable_lever: vp ? "Promo Budget Reallocation & Air-Freight Buffer" : "Warehouse Carrier Route Allocation",
        action: vp ? "Approve $25k air-freight buffer and cap West flash discounts at 10%." : "Shift 65% of West outbound to Backup Carrier BlueDart B.",
        expected_impact: "+$64,000 revenue recovery within 5 business days",
        owner: vp ? "VP Commercial / CCO" : "Regional Operations Lead"
      }
    },
    abstention: {
      executive_headline: "⚠ SYSTEM ABSTAINED: Contradictory Evidence — Automated Supplier Penalty Suppressed.",
      grounded_narrative: "Returns spiked +14% in Electronics, but sentiment is 92% positive on sound quality. Courier damage logs show 45 transit crush events. Bayesian posterior (41.2%) is below the 60% threshold — abstention enforced.",
      seven_pillar_action_matrix: {
        controllable_lever: "Mandatory Physical Inspection Protocol",
        action: "Quarantine and audit 50 returned packages at Central Warehouse.",
        expected_impact: "Prevents false supplier disputes. 100% empirical ground truth.",
        owner: "QA & Logistics Audit Lead"
      }
    },
    cold_start: {
      executive_headline: "Launch Alert: EV Smart Charger Pack Pro — Day 10 drop outside Bayesian category bands.",
      grounded_narrative: "With 11 days of history, STL cannot run. Hierarchical Bayesian Prior (EV Accessories peer mean: 21.5 units) flagged Day 10 (4 units) below the 95% lower bound (15.2 units). Post-launch email promo ended Day 8 without follow-up.",
      seven_pillar_action_matrix: {
        controllable_lever: "Targeted Category Retargeting Campaign",
        action: "Deploy automated re-engagement email to existing EV Accessories customers.",
        expected_impact: "Restore velocity to peer baseline (18–22 units/day).",
        owner: "Growth Marketing Lead"
      }
    }
  };

  renderScenarioUI({
    scenario_id: scenarioId,
    executive_memo: memos[scenarioId],
    bayesian_evaluation: scenarioId === "abstention"
      ? { abstention_banner_text: "⚠ SYSTEM ABSTAINED: Evidence is contradictory between logistics claims and 92% positive product reviews. Automated supplier penalties suppressed." }
      : null,
    telemetry: { total_pipeline_latency_ms: 345, tokens_consumed: 420, cost_usd: 0.00028 }
  });
}

// ── Action Execute Button ────────────────────────────────────
function executeAction() {
  const btn = document.getElementById("btnExecuteAction");
  if (!btn) return;
  btn.innerHTML = `<i data-lucide="check" style="width:13px;height:13px;"></i><span>Dispatched — 200 OK</span>`;
  btn.style.cssText = "flex:1;background:linear-gradient(135deg,#059669,#047857);box-shadow:0 2px 8px rgba(5,150,105,0.4);color:#ffffff !important;padding:9px 16px;border-radius:8px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;cursor:pointer;";
  if (window.lucide) lucide.createIcons();
  showToast("Action dispatched to enterprise ERP/WMS.", "success");

  setTimeout(() => {
    btn.innerHTML = `<i data-lucide="play" style="width:13px;height:13px;"></i><span>1-Click Execute</span>`;
    btn.style.cssText = "";
    btn.className = "btn-primary";
    btn.style.flex = "1";
    if (window.lucide) lucide.createIcons();
  }, 3500);
}

// ── Modals ───────────────────────────────────────────────────
function openFeedbackModal()  { document.getElementById("feedbackModal").style.display  = "flex"; }
function closeFeedbackModal() { document.getElementById("feedbackModal").style.display  = "none"; }
function openContractModal()  { document.getElementById("contractModal").style.display  = "flex"; }
function closeContractModal() { document.getElementById("contractModal").style.display  = "none"; }

async function submitAnalystFeedback() {
  const driver  = document.getElementById("fbDriverSelect").value;
  const comment = document.getElementById("fbComment").value;
  try {
    await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incident_id: "INC-20260715-WEST", user_role: currentPersona, feedback_type: "thumbs_up", confirmed_driver: driver, analyst_comment: comment })
    });
  } catch (_) {}
  closeFeedbackModal();
  showToast(`Bayesian prior updated for: ${driver}`, "success");
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  const colors = {
    success: { border: "rgba(16,185,129,0.35)", color: "#10B981", bg: "var(--bg-surface)" },
    warning: { border: "rgba(245,158,11,0.35)", color: "#F59E0B", bg: "var(--bg-surface)" },
    info:    { border: "rgba(124,58,237,0.35)", color: "var(--purple-light)", bg: "var(--bg-surface)" }
  };
  const c = colors[type] || colors.info;
  toast.className = "animate-slide-up";
  toast.style.cssText = `
    background:${c.bg};
    border:1px solid ${c.border};
    color:${c.color};
    border-radius:8px;
    padding:10px 14px;
    font-size:12px;
    font-weight:600;
    max-width:340px;
    box-shadow:0 8px 24px rgba(0,0,0,0.25);
    pointer-events:auto;
    line-height:1.4;
  `;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.transition = "opacity 0.3s"; toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ── Theme Toggle ─────────────────────────────────────────────
function toggleTheme() {
  const root = document.documentElement;
  const container = document.getElementById("themeIconContainer");

  if (currentTheme === "dark") {
    currentTheme = "light";
    root.classList.remove("dark");
    root.classList.add("light");
    if (container) {
      container.innerHTML = `<i data-lucide="moon" style="width:16px;height:16px;color:#7C3AED;"></i>`;
    }
    showToast("Light theme active.", "info");
  } else {
    currentTheme = "dark";
    root.classList.remove("light");
    root.classList.add("dark");
    if (container) {
      container.innerHTML = `<i data-lucide="sun" style="width:16px;height:16px;color:#F59E0B;"></i>`;
    }
    showToast("Dark theme active.", "info");
  }
  if (window.lucide) lucide.createIcons();
  updateChartTheme();
}

function updateChartTheme() {
  if (!kpiChartInstance) return;
  const dark = currentTheme === "dark";
  const grid = dark ? "rgba(71,85,105,0.20)" : "rgba(203,213,225,0.65)";
  const tick = dark ? "#64748B" : "#334155";
  kpiChartInstance.options.scales.x.grid.color = grid;
  kpiChartInstance.options.scales.x.ticks.color = tick;
  kpiChartInstance.options.scales.y.grid.color = grid;
  kpiChartInstance.options.scales.y.ticks.color = tick;
  kpiChartInstance.update();
}
