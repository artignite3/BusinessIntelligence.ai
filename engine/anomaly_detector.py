from typing import Dict, Any, List
import numpy as np
import pandas as pd


def compute_stl_mad_anomaly(
    df: pd.DataFrame, metric_col: str = "net_revenue", threshold: float = 2.50
) -> Dict[str, Any]:
    daily = df.groupby("date")[metric_col].sum().reset_index()
    daily["date"] = pd.to_datetime(daily["date"])
    daily = daily.sort_values("date").reset_index(drop=True)

    values = daily[metric_col].values
    # 7-day rolling median as a lightweight trend proxy (STL residuals)
    trend = pd.Series(values).rolling(window=7, min_periods=1, center=True).median().values
    residuals = values - trend

    med_r = np.median(residuals)
    mad = np.median(np.abs(residuals - med_r))
    scale = 1.4826 * mad if mad > 1e-6 else 1.0
    z_scores = np.abs(residuals - med_r) / scale

    daily["trend"] = trend
    daily["residual"] = residuals
    daily["z_score"] = np.round(z_scores, 2)
    daily["is_material_anomaly"] = z_scores >= threshold

    anomalies: List[Dict[str, Any]] = []
    for _, row in daily[daily["is_material_anomaly"]].iterrows():
        pct_dev = round(((row[metric_col] - row["trend"]) / (row["trend"] + 1e-6)) * 100, 2)
        anomalies.append({
            "date": row["date"].strftime("%Y-%m-%d"),
            "observed_value": float(round(row[metric_col], 2)),
            "baseline_trend": float(round(row["trend"], 2)),
            "percentage_deviation": float(pct_dev),
            "z_score": float(row["z_score"]),
            "materiality_severity": "CRITICAL" if row["z_score"] >= 3.5 else "HIGH",
        })

    ts_records = [
        {
            "date": r["date"].strftime("%Y-%m-%d"),
            metric_col: float(round(r[metric_col], 2)),
            "trend": float(round(r["trend"], 2)),
            "z_score": float(r["z_score"]),
            "is_material_anomaly": bool(r["is_material_anomaly"]),
        }
        for _, r in daily.iterrows()
    ]

    return {
        "metric_analyzed": metric_col,
        "threshold_used": float(threshold),
        "total_time_points": int(len(daily)),
        "anomalies_detected_count": int(len(anomalies)),
        "anomalies": anomalies,
        "time_series_data": ts_records,
    }


if __name__ == "__main__":
    df = pd.read_csv("data/sales_orders.csv")
    res = compute_stl_mad_anomaly(df, "net_revenue")
    print(f"Detected {res['anomalies_detected_count']} anomalies.")
