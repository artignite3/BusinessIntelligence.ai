# 📜 Governed Semantic Data Contracts (`/contracts`)

This directory contains the declarative **Semantic Data Contracts** that enforce data governance, KPI definitions, lineage, materiality thresholds, and Role-Based Access Controls (RBAC) across the entire intelligence engine.

---

## 📁 Directory Structure
```
contracts/
├── kpi_contract.yaml       # Primary YAML Semantic Contract specification
└── README.md               # Directory documentation
```

---

## 🔍 Core Specifications in `kpi_contract.yaml`

### 1. Heterogeneous Data Sources
* **`source_a_sales`**: Relational SQL ERP ledger (Daily refresh, SKU grain, immutable ledger).
* **`source_b_logistics`**: WMS supply chain stream (Hourly refresh, carrier & shipment grain).
* **`source_c_customer_voice`**: Unstructured customer reviews and tickets (Continuous streaming).

### 2. Governed KPI Formulas & Materiality Thresholds
* **Net Revenue (`KPI-001`)**:
  $$\text{Net Revenue} = \sum(\text{Gross Sales}) - \sum(\text{Discounts}) - \sum(\text{Refunds})$$
  *Threshold:* $\mathcal{Z} \ge 2.50\sigma$ or Absolute variance $\ge \$50,000$.
* **OTIF Fulfillment Rate (`KPI-002`)**:
  $$\text{OTIF} = \frac{\text{Shipments delivered on-time \& in-full}}{\text{Total Shipments}}$$
  *Threshold:* $\mathcal{Z} \ge 2.00\sigma$ or Rate drop $\ge 5.0\%$.
* **Customer Return Rate (`KPI-003`)**:
  $$\text{Return Rate} = \frac{\text{Total Returned Units}}{\text{Total Orders}}$$
  *Threshold:* $\mathcal{Z} \ge 2.50\sigma$ or Return surge $\ge 3.0\%$.
* **Cold-Start Launch SKU (`KPI-004`)**:
  *History:* $< 14$ days empirical data.
  *Strategy:* Hierarchical Bayesian category prior smoothing (Category: `EV Accessories`).

### 3. Role-Based Access Control (RBAC) & Column Masking
* **VP Commercial / CCO**: Full global enterprise visibility, unmasked margins, pricing levers.
* **Regional Operations Lead**: Region-filtered rows (`region = user.assigned_region`), financial cost columns masked (`margin_cost`, `executive_discount_budget`), operational dispatch levers.
