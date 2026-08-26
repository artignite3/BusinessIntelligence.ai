"""Active continuous learning feedback loop updating Bayesian causal priors."""

import json
import os
from datetime import datetime
from typing import Dict, Any, List

FEEDBACK_STORE_PATH = "data/feedback_store.json"
PRIORS_STATE_PATH = "data/causal_priors.json"

DEFAULT_PRIORS: Dict[str, float] = {
    "Logistics Dispatch & Port Bottleneck": 0.40,
    "Payment Gateway Checkout Failures": 0.30,
    "Promotional Discount Over-Allocation": 0.20,
    "Customer Product Returns": 0.10,
}


def load_causal_priors() -> Dict[str, float]:
    if os.path.exists(PRIORS_STATE_PATH):
        with open(PRIORS_STATE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return DEFAULT_PRIORS.copy()


def record_user_feedback(
    incident_id: str,
    user_role: str,
    feedback_type: str,
    confirmed_driver: str,
    analyst_comment: str = "",
) -> Dict[str, Any]:
    feedback_entry = {
        "feedback_id": f"FB-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "timestamp": datetime.now().isoformat(),
        "incident_id": str(incident_id),
        "user_role": str(user_role),
        "feedback_type": str(feedback_type),
        "confirmed_driver": str(confirmed_driver),
        "analyst_comment": str(analyst_comment),
    }

    history: List[Dict[str, Any]] = []
    if os.path.exists(FEEDBACK_STORE_PATH):
        with open(FEEDBACK_STORE_PATH, "r", encoding="utf-8") as f:
            history = json.load(f)

    history.append(feedback_entry)
    with open(FEEDBACK_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

    priors = load_causal_priors()
    learning_rate = 0.05

    if feedback_type in ["thumbs_up", "override"] and confirmed_driver in priors:
        priors[confirmed_driver] += learning_rate
        total = sum(priors.values())
        for k in priors:
            priors[k] = round(priors[k] / total, 3)

        with open(PRIORS_STATE_PATH, "w", encoding="utf-8") as f:
            json.dump(priors, f, indent=2)

    return {
        "status": "FEEDBACK_RECORDED_PRIORS_UPDATED",
        "feedback_id": feedback_entry["feedback_id"],
        "updated_causal_priors": priors,
        "message": f"Prior weight for '{confirmed_driver}' successfully adjusted via Bayesian active learning.",
    }


if __name__ == "__main__":
    res = record_user_feedback(
        "INC-001",
        "VP Commercial",
        "thumbs_up",
        "Logistics Dispatch & Port Bottleneck",
    )
    print(res["message"])
