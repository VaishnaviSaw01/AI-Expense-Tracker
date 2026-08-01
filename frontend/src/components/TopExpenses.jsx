function TopExpenses({ topExpenses }) {
  return (
    <div className="card">
      <h2 className="card__title"><span className="card__title-mark" />Top expenses</h2>
      {(!topExpenses || topExpenses.length === 0) ? (
        <p className="ledger__empty">Nothing to rank yet.</p>
      ) : (
        <div>
          {topExpenses.map((exp, i) => (
            <div className="receipt__row" key={exp._id || i}>
              <span>
                <span className="receipt__rank">#{i + 1}</span>
                <span className="receipt__desc">{exp.description}</span>
              </span>
              <span className="receipt__amount">₹{exp.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopExpenses;