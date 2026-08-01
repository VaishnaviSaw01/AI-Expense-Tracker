import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import TopExpenses from "../components/TopExpenses";
import InsightCard from "../components/InsightCard";
import CategoryFilter from "../components/CategoryFilter";
import ThemeToggle from "../components/ThemeToggle";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({
    categoryTotals: {},
    monthlyTotals: {},
    totalSpend: 0,
    uniqueCategories: [],
    topExpenses: [],
  });
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loadError, setLoadError] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/expenses", { params: { sortBy, order } });
      setExpenses(res.data.expenses);
      setAnalytics(res.data.analytics);
      setLoadError("");
    } catch (err) {
      setLoadError("Can't reach the backend. Make sure the server is running on port 5000.");
    }
  }, [sortBy, order]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function handleAdd(payload) {
    await axiosInstance.post("/expenses", payload);
    await fetchExpenses();
  }

  async function handleDelete(id) {
    await axiosInstance.delete(`/expenses/${id}`);
    await fetchExpenses();
  }

  function handleSortChange(newSortBy, newOrder) {
    setSortBy(newSortBy);
    setOrder(newOrder);
  }

  const visibleExpenses =
    activeCategory === "All" ? expenses : expenses.filter((e) => e.category === activeCategory);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="app__inner">
        <header className="header">
          <div>
            <p className="header__eyebrow">Ledger · AI Expense Tracker</p>
            <h1 className="header__title">Where did it go?</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((d) => !d)} />
            <div className="header__total">
              <div className="header__total-label">Total spend</div>
              <div className="header__total-value">₹{analytics.totalSpend.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </header>

        {loadError && <p className="form__error">{loadError}</p>}

        <div className="layout">
          <div className="stack">
            <ExpenseForm onAdd={handleAdd} existingCategories={analytics.uniqueCategories} />

            <CategoryFilter
              categories={analytics.uniqueCategories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
           <ExpenseList
  expenses={visibleExpenses}
  onDelete={handleDelete}
  sortBy={sortBy}
  order={order}
  onSortChange={handleSortChange}
  categories={analytics.uniqueCategories}
/>
          </div>

          <div className="stack">
            <ExpenseChart categoryTotals={analytics.categoryTotals} />
            <TopExpenses topExpenses={analytics.topExpenses} />
          </div>
        </div>
        <InsightCard hasExpenses={expenses.length > 0} />
        <p className="footnote">merge sort · binary search · hashmap · set · max-heap</p>
      </div>
    </div>
  );
}

export default Dashboard;