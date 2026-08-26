# 🌐 FastAPI Backend Gateway (`/backend`)

This directory contains the production-grade **FastAPI REST API Gateway** that connects the deterministic analytics core to the interactive frontend executive canvas.

---

## 📁 Directory Structure
```
backend/
├── main.py         # Primary FastAPI Application & Route Handlers
├── __init__.py     # Backend package initializer
└── README.md       # Directory documentation
```

---

## 🔌 API Endpoints Reference

| HTTP Method | Route | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/` | Health check & engine metadata. | None |
| **`GET`** | `/api/contract` | Returns parsed YAML semantic data contract. | None |
| **`GET`** | `/api/kpi/trend` | Returns 45-day time-series with STL trendline & anomalies. | `?metric=net_revenue&threshold=2.50` |
| **`POST`** | `/api/scenarios/run` | Executes end-to-end analytical pipeline for a scenario. | `{"scenario_id": "multi_factor"\|"abstention"\|"cold_start", "persona": "vp_commercial"\|"regional_ops_lead"}` |
| **`POST`** | `/api/feedback` | Records analyst validation & updates Bayesian causal priors. | `{"incident_id": "...", "feedback_type": "thumbs_up", "confirmed_driver": "..."}` |
| **`GET`** | `/api/priors` | Returns active Bayesian causal prior weights. | None |
| **`GET`** | `/api/telemetry` | Returns latency, token consumption, and cost telemetry. | None |

---

## 🚀 Running the Backend Server
```bash
# From project root:
python -m uvicorn backend.main:app --reload --port 8000
```
* **Interactive Swagger UI Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
