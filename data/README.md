# 🗄️ Heterogeneous Enterprise Datasets (`/data`)

This directory contains synthetic enterprise datasets across multiple sources, grains, and refresh cadences used to validate the 4 mandatory Accenture case study scenarios.

---

## 📁 Directory Structure
```
data/
├── connectors/
│   ├── normalizer.py         # Schema Normalizer mapping portal columns to engine schema
│   ├── api_connector.py      # REST API Connector template for live ERP/WMS portals
│   ├── db_connector.py       # SQL Warehouse Connector (Snowflake, Postgres, BigQuery)
│   └── __init__.py
├── sales_orders.csv          # Source A: Daily Financial Sales Ledger (ERP)
├── logistics_wms.csv         # Source B: Hourly Logistics & Shipment Telemetry (WMS)
├── customer_feedback.json    # Source C: Unstructured Reviews, Tickets & Error Logs
├── cold_start_sku.csv        # Scenario 3: 11-Day New Product Launch Dataset
├── causal_priors.json        # Dynamic Bayesian Causal Prior Weights
├── feedback_store.json       # Historical Analyst Feedback Log
├── generate_datasets.py      # Dataset Generator Script
└── README.md                 # Directory documentation
```

---

## 📊 Dataset Grains & Scenario Injections

| Dataset | Grain | Cadence | Case Study Scenario Injected |
| :--- | :--- | :--- | :--- |
| **`sales_orders.csv`** | `date`, `region`, `category` | Daily Batch | **Scenario 1 (Day 14):** Deep discount allocation & order cancellation surge in West Region Electronics. |
| **`logistics_wms.csv`** | `date`, `region`, `carrier_id` | Hourly Stream | **Scenario 1:** 48.5h dispatch delay at West Coast Port.<br>**Scenario 2 (Days 20-22):** 45 package transit damage claims by Courier C. |
| **`customer_feedback.json`** | `ticket_id`, `date`, `topic` | Streaming | **Scenario 1:** 40 iOS checkout timeout complaints (#504).<br>**Scenario 2:** 35 tickets praising sound quality while reporting crushed shipping boxes. |
| **`cold_start_sku.csv`** | `sku_id`, `launch_day_number` | Daily | **Scenario 3:** 11-day EV Charger sales trajectory with Day 10 promo deceleration. |

---

## 🔌 Plug-and-Play Real Data Connectors (`data/connectors/`)

The 7 analytical engines take standard `pandas.DataFrame` inputs and are **100% decoupled** from the data source. To connect live enterprise portals, only the data ingestion layer changes:

* **`normalizer.py`**: Maps external portal columns (e.g., `TransactionDate`, `GrossRevenue`, `COGS`) into standard engine column names (`date`, `gross_amount`, `margin_cost`).
* **`api_connector.py`**: Pulls data via authenticated REST APIs (`requests.get`) and normalizes it on the fly.
* **`db_connector.py`**: Queries cloud data warehouses (Snowflake, BigQuery, PostgreSQL) via SQLAlchemy.

---

## 🚀 Regenerating Datasets
To regenerate fresh synthetic data, run:
```bash
python data/generate_datasets.py
```
