import { useState } from "react";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Education", "Health", "Other"];

function ExpenseForm({ onAdd, existingCategories }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const categoryOptions = Array.from(new Set([...DEFAULT_CATEGORIES, ...(existingCategories || [])]));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!description.trim()) return setError("Add a short description.");
    if (!amount || Number(amount) <= 0) return setError("Amount must be greater than 0.");

    try {
      await onAdd({ description: description.trim(), category, amount: Number(amount), date });
      setDescription("");
      setAmount("");
    } catch (err) {
      setError("Couldn't save that expense. Check the server is running.");
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="card__title"><span className="card__title-mark" />Add an expense</h2>

      <div className="form__row">
        <div className="form__field">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="e.g. Groceries"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form__field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="form__row">
        <div className="form__field">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form__field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {error && <p className="form__error">{error}</p>}

      <button type="submit" className="form__submit">Save expense</button>
    </form>
  );
}

export default ExpenseForm;