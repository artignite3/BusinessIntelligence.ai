from typing import Dict
import pandas as pd

# Column aliases from various ERP/WMS vendors mapped to internal schema names
SALES_COLUMN_MAP: Dict[str, str] = {
    "TransactionDate": "date", "Date": "date", "sale_date": "date",
    "SalesTerritory": "region", "Region": "region", "sales_region": "region",
    "ProductCategory": "category", "Category": "category", "product_cat": "category",
    "OrderVolume": "orders_count", "total_orders": "orders_count",
    "GrossRevenue": "gross_amount", "gross_sales": "gross_amount",
    "DiscountAmount": "discounts", "disc_amount": "discounts",
    "RefundTotal": "returns_refund", "refunds": "returns_refund",
    "COGS": "margin_cost", "cogs_amount": "margin_cost",
    "NetRevenue": "net_revenue", "revenue_net": "net_revenue",
    "CancelledOrders": "cancellations", "cancellations_count": "cancellations",
}

LOGISTICS_COLUMN_MAP: Dict[str, str] = {
    "TelemetryDate": "date", "Date": "date",
    "Territory": "region",
    "CarrierName": "primary_carrier", "carrier": "primary_carrier",
    "DispatchDelayHours": "avg_dispatch_delay_hours", "dispatch_delay": "avg_dispatch_delay_hours",
    "OTIFScore": "otif_percentage", "otif_rate": "otif_percentage",
    "TransitDamageEvents": "transit_damage_claims", "damage_claims": "transit_damage_claims",
    "StockoutFlag": "warehouse_stockout_flag",
}


def normalize_sales_dataframe(df_raw: pd.DataFrame) -> pd.DataFrame:
    df = df_raw.rename(columns=SALES_COLUMN_MAP)
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
    return df


def normalize_logistics_dataframe(df_raw: pd.DataFrame) -> pd.DataFrame:
    df = df_raw.rename(columns=LOGISTICS_COLUMN_MAP)
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
    return df
