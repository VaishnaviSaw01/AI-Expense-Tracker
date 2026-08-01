/**
 * uniqueSet.js
 * ------------
 * Uses a Set to track distinct categories the user has ever used.
 */

function getUniqueCategories(expenses) {
  const categorySet = new Set();
  for (const exp of expenses) {
    categorySet.add(exp.category);
  }
  return Array.from(categorySet);
}

function isKnownCategory(expenses, category) {
  const categorySet = new Set(expenses.map((e) => e.category));
  return categorySet.has(category);
}

module.exports = { getUniqueCategories, isKnownCategory };