"""REST API connector for fetching sales and logistics data from enterprise portals."""

from typing import Optional, Dict, Any
import requests
import pandas as pd
from data.connectors.normalizer import (
    normalize_sales_dataframe,
    normalize_logistics_dataframe,
)


def fetch_sales_from_api(
    endpoint_url: str = "https://api.enterprise-erp.com/v1/sales",
    api_token: Optional[str] = None,
    params: Optional[Dict[str, Any]] = None,
) -> pd.DataFrame:
    headers = {"Authorization": f"Bearer {api_token}"} if api_token else {}
    try:
        response = requests.get(
            endpoint_url, headers=headers, params=params or {}, timeout=10
        )
        response.raise_for_status()
        data = response.json()
        raw_df = pd.DataFrame(data.get("records", data))
        return normalize_sales_dataframe(raw_df)
    except Exception as e:
        print(f"API fetch fallback to local store: {e}")
        return pd.read_csv("data/sales_orders.csv")


def fetch_logistics_from_api(
    endpoint_url: str = "https://api.enterprise-wms.com/v1/telemetry",
    api_token: Optional[str] = None,
    params: Optional[Dict[str, Any]] = None,
) -> pd.DataFrame:
    headers = {"Authorization": f"Bearer {api_token}"} if api_token else {}
    try:
        response = requests.get(
            endpoint_url, headers=headers, params=params or {}, timeout=10
        )
        response.raise_for_status()
        data = response.json()
        raw_df = pd.DataFrame(data.get("records", data))
        return normalize_logistics_dataframe(raw_df)
    except Exception as e:
        print(f"API fetch fallback to local store: {e}")
        return pd.read_csv("data/logistics_wms.csv")
