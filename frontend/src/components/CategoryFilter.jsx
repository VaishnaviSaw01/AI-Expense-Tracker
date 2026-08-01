function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="pills">
      <button
        className={`pill ${active === "All" ? "pill--active" : ""}`}
        onClick={() => onChange("All")}
        type="button"
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          className={`pill ${active === c ? "pill--active" : ""}`}
          onClick={() => onChange(c)}
          type="button"
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;