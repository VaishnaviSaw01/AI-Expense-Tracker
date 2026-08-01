import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { getCategoryColor } from "../utils/categoryColors";

function ExpenseChart({ categoryTotals }) {
  const categories = Object.keys(categoryTotals || {});
  const data = categories.map((category) => ({
    category,
    total: categoryTotals[category],
  }));

  return (
    <div className="card">
      <h2 className="card__title"><span className="card__title-mark" />Spend by category</h2>
      <div className="chart-wrap">
        {data.length === 0 ? (
          <p className="ledger__empty">Add expenses to see the breakdown.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1E5EC" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#5B6270" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5B6270" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Spent"]}
                contentStyle={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.category} fill={getCategoryColor(entry.category, categories)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default ExpenseChart;