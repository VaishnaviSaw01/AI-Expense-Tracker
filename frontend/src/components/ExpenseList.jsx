import { getCategoryColor } from "../utils/categoryColors";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function ExpenseList({ expenses, onDelete, sortBy, order, onSortChange, categories }) {
  return (
    <div className="card">
      <h2 className="card__title"><span className="card__title-mark" />Ledger</h2>

      <div className="sort-controls">
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value, order)}>
          <option value="date">Sort by date</option>
          <option value="amount">Sort by amount</option>
        </select>
        <select value={order} onChange={(e) => onSortChange(sortBy, e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="ledger">
        {expenses.length === 0 && (
          <p className="ledger__empty">No expenses yet — add your first one on the left.</p>
        )}

        {expenses.map((exp) => (
          <div
            className="ledger__row"
            key={exp._id}
            style={{ "--accent-color": getCategoryColor(exp.category, categories) }}
          >
            <span className="ledger__date">{formatDate(exp.date)}</span>
            <div className="ledger__desc">
              <span className="ledger__desc-text">{exp.description}</span>
              <span className="ledger__category">{exp.category}</span>
            </div>
            <span className="ledger__amount">₹{exp.amount.toLocaleString("en-IN")}</span>
            <button className="ledger__delete" onClick={() => onDelete(exp._id)} type="button">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;