import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function InsightCard({ hasExpenses }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchInsight() {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/insights");
      setInsight(res.data.insight);
    } catch (err) {
      setError("Couldn't fetch an insight right now. Check your Gemini API key on the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card card--horizontal">
      <div className="card__side">
        <h2 className="card__title"><span className="card__title-mark" />AI insight</h2>
        <button
          className="insight__button"
          onClick={fetchInsight}
          disabled={loading || !hasExpenses}
          type="button"
        >
          {loading ? "Thinking…" : "Get AI insight"}
        </button>
        {!hasExpenses && <p className="insight__hint">Add a few expenses first.</p>}
        {error && <p className="form__error">{error}</p>}
      </div>

      <div className="card__main">
        {insight ? (
          <div className="insight__sections">
            {insight.overview && (
              <div className="insight__section">
                <h4 className="insight__heading">Spending Overview</h4>
                <p className="insight__text">{insight.overview}</p>
              </div>
            )}
            {insight.optimize && (
              <div className="insight__section">
                <h4 className="insight__heading">Areas to Optimize</h4>
                <p className="insight__text">{insight.optimize}</p>
              </div>
            )}
            {insight.recommendation && (
              <div className="insight__section">
                <h4 className="insight__heading">Actionable Recommendation</h4>
                <p className="insight__text">{insight.recommendation}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="insight__placeholder">
            Your personalized spending analysis will appear here — category breakdown, areas to cut back, and a concrete action you can take this month.
          </p>
        )}
      </div>
    </div>
  );
}

export default InsightCard;