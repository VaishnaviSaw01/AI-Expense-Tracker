/**
 * aggregator.js
 * -------------
 * Uses a HashMap (JavaScript Map) to group and total expenses.
 * Time Complexity: O(n) — a single pass, O(1) lookup/update per entry.
 */

function aggregateByCategory(expenses) {
  const categoryMap = new Map();

  for (const exp of expenses) {
    const current = categoryMap.get(exp.category) || 0;
    categoryMap.set(exp.category, current + exp.amount);
  }

  return Object.fromEntries(categoryMap);
}

function aggregateByMonth(expenses) {
  const monthMap = new Map();

  for (const exp of expenses) {
    const d = new Date(exp.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const current = monthMap.get(monthKey) || 0;
    monthMap.set(monthKey, current + exp.amount);
  }

  return Object.fromEntries(monthMap);
}

function getTotalSpend(expenses) {
  let total = 0;
  for (const exp of expenses) total += exp.amount;
  return total;
}

module.exports = { aggregateByCategory, aggregateByMonth, getTotalSpend };