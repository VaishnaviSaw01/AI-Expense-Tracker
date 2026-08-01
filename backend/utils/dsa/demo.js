/**
 * demo.js
 * -------
 * Standalone script to prove the DSA logic works correctly, using sample
 * data — no MongoDB connection required. Run with: npm run test:dsa
 */

const { mergeSort } = require("./sorting");
const { searchByDateRange } = require("./searching");
const { aggregateByCategory, aggregateByMonth, getTotalSpend } = require("./aggregator");
const { getUniqueCategories } = require("./uniqueSet");
const { getTopNExpenses } = require("./topExpenses");

const sampleExpenses = [
  { description: "Groceries", category: "Food", amount: 1200, date: "2026-07-05" },
  { description: "Uber ride", category: "Transport", amount: 350, date: "2026-07-02" },
  { description: "Movie night", category: "Entertainment", amount: 600, date: "2026-07-10" },
  { description: "Electricity bill", category: "Utilities", amount: 2200, date: "2026-07-01" },
  { description: "Restaurant", category: "Food", amount: 1800, date: "2026-07-15" },
  { description: "Textbook", category: "Education", amount: 900, date: "2026-06-28" },
  { description: "Gym membership", category: "Health", amount: 1500, date: "2026-07-08" },
  { description: "Bus pass", category: "Transport", amount: 500, date: "2026-07-20" },
];

console.log("========== 1. MERGE SORT (by date, ascending) ==========");
const sortedByDate = mergeSort(sampleExpenses, "date", "asc");
sortedByDate.forEach((e) => console.log(`${e.date}  ${e.description.padEnd(20)} ₹${e.amount}`));

console.log("\n========== 2. MERGE SORT (by amount, descending) ==========");
const sortedByAmount = mergeSort(sampleExpenses, "amount", "desc");
sortedByAmount.forEach((e) => console.log(`₹${String(e.amount).padEnd(6)} ${e.description}`));

console.log("\n========== 3. BINARY SEARCH (date range: 2026-07-01 to 2026-07-10) ==========");
const inRange = searchByDateRange(sortedByDate, "2026-07-01", "2026-07-10");
inRange.forEach((e) => console.log(`${e.date}  ${e.description}  ₹${e.amount}`));

console.log("\n========== 4. HASHMAP AGGREGATION (by category) ==========");
console.log(aggregateByCategory(sampleExpenses));

console.log("\n========== 5. HASHMAP AGGREGATION (by month) ==========");
console.log(aggregateByMonth(sampleExpenses));

console.log("\n========== 6. TOTAL SPEND ==========");
console.log(`Total: ₹${getTotalSpend(sampleExpenses)}`);

console.log("\n========== 7. SET (unique categories) ==========");
console.log(getUniqueCategories(sampleExpenses));

console.log("\n========== 8. MAX-HEAP (top 3 expenses) ==========");
const top3 = getTopNExpenses(sampleExpenses, 3);
top3.forEach((e, i) => console.log(`#${i + 1}: ${e.description} — ₹${e.amount}`));