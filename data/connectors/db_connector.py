"""Database and Cloud Data Warehouse connector (Snowflake, BigQuery, PostgreSQL)."""

from typing import Optional
import pandas as pd
from data.connectors.normalizer import (
    normalize_sales_dataframe,
    normalize_logistics_dataframe,
)


def fetch_sales_from_warehouse(
    connection_uri: str = "postgresql://user:password@localhost:5432/enterprise_db",
    query: Optional[str] = None,
) -> pd.DataFrame:
    default_query = """
        SELECT date, region, category, orders_count, gross_amount,
               discounts, returns_refund, margin_cost, net_revenue, cancellations
        FROM erp.sales_orders
        WHERE date >= '2026-07-01'
    """
    try:
        raw_df = pd.read_sql(query or default_query, connection_uri)
        return normalize_sales_dataframe(raw_df)
    except Exception as e:
        print(f"Database query fallback to local store: {e}")
        return pd.read_csv("data/sales_orders.csv")


def fetch_logistics_from_warehouse(
    connection_uri: str = "postgresql://user:password@localhost:5432/enterprise_db",
    query: Optional[str] = None,
) -> pd.DataFrame:
    default_query = """
        SELECT date, region, primary_carrier, avg_dispatch_delay_hours,
               otif_percentage, transit_damage_claims, warehouse_stockout_flag
        FROM wms.logistics_telemetry
        WHERE date >= '2026-07-01'
    """
    try:
        raw_df = pd.read_sql(query or default_query, connection_uri)
        return normalize_logistics_dataframe(raw_df)
    except Exception as e:
        print(f"Database query fallback to local store: {e}")
        return pd.read_csv("data/logistics_wms.csv")
