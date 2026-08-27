from typing import Optional
import pandas as pd
from data.connectors.normalizer import normalize_sales_dataframe, normalize_logistics_dataframe


def fetch_sales_from_api(
    endpoint_url: str = "https://api.enterprise-erp.com/v1/sales",
    api_token: Optional[str] = None,
    params: Optional[dict] = None,
) -> pd.DataFrame:
    import requests
    headers = {"Authorization": f"Bearer {api_token}"} if api_token else {}
    try:
        resp = requests.get(endpoint_url, headers=headers, params=params or {}, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return normalize_sales_dataframe(pd.DataFrame(data.get("records", data)))
    except Exception as e:
        print(f"API fetch failed, falling back to local CSV: {e}")
        return pd.read_csv("data/sales_orders.csv")


def fetch_logistics_from_api(
    endpoint_url: str = "https://api.enterprise-wms.com/v1/telemetry",
    api_token: Optional[str] = None,
    params: Optional[dict] = None,
) -> pd.DataFrame:
    import requests
    headers = {"Authorization": f"Bearer {api_token}"} if api_token else {}
    try:
        resp = requests.get(endpoint_url, headers=headers, params=params or {}, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return normalize_logistics_dataframe(pd.DataFrame(data.get("records", data)))
    except Exception as e:
        print(f"API fetch failed, falling back to local CSV: {e}")
        return pd.read_csv("data/logistics_wms.csv")
