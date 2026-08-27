import json
from typing import Dict, Any, List
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class UnstructuredContextEngine:
    def __init__(self, tickets_file_path: str = "data/customer_feedback.json"):
        with open(tickets_file_path, "r", encoding="utf-8") as f:
            self.tickets = json.load(f)

        self.corpus = [t["text"] for t in self.tickets]
        # Bigrams improve topic cluster separation for short support tickets
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        self.doc_vectors = self.vectorizer.fit_transform(self.corpus)

    def search_context_by_anomaly(
        self,
        query: str,
        target_date: str = "2026-07-15",
        region: str = "West",
        top_k: int = 5,
    ) -> Dict[str, Any]:
        query_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(query_vec, self.doc_vectors)[0]

        # Filter to target date then rank by semantic similarity
        date_matches = [
            (idx, sims[idx], t)
            for idx, t in enumerate(self.tickets)
            if t["date"] == target_date
        ]
        date_matches.sort(key=lambda x: x[1], reverse=True)

        top_matches: List[Dict[str, Any]] = []
        sentiments: List[float] = []
        topic_counts: Dict[str, int] = {}

        for idx, score, t in date_matches[:top_k]:
            sentiments.append(float(t["sentiment_score"]))
            topic = str(t["topic"])
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
            top_matches.append({
                "ticket_id": str(t["ticket_id"]),
                "date": str(t["date"]),
                "region": str(t["region"]),
                "topic": topic,
                "sentiment_score": float(t["sentiment_score"]),
                "semantic_similarity": float(round(score, 3)),
                "excerpt": str(t["text"]),
            })

        avg_sentiment = float(np.mean(sentiments)) if sentiments else 0.0

        return {
            "query_used": str(query),
            "target_date": str(target_date),
            "total_date_tickets_scanned": int(len(date_matches)),
            "top_topic_clusters": {str(k): int(v) for k, v in topic_counts.items()},
            "average_customer_sentiment": float(round(avg_sentiment, 2)),
            "sentiment_diagnosis": (
                "Severely Negative" if avg_sentiment < -0.4
                else ("Positive" if avg_sentiment > 0.3 else "Mixed/Neutral")
            ),
            "retrieved_evidence": top_matches,
        }


if __name__ == "__main__":
    engine = UnstructuredContextEngine()
    res = engine.search_context_by_anomaly("Payment gateway error checkout timeout", "2026-07-15")
    print(f"Retrieved {len(res['retrieved_evidence'])} tickets.")
