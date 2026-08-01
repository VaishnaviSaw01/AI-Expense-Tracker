/**
 * sorting.js
 * -----------
 * Custom Merge Sort implementation used to sort the expense list.
 * Time Complexity : O(n log n)  — better than the O(n^2) of bubble/insertion sort
 * Space Complexity: O(n)         — due to the temporary arrays used while merging
 *
 * We implement this ourselves (instead of Array.prototype.sort) to demonstrate
 * the DSA concept. `key` can be "date" or "amount", `order` can be "asc" or "desc".
 */

function mergeSort(expenses, key = "date", order = "asc") {
  if (expenses.length <= 1) return expenses;

  const mid = Math.floor(expenses.length / 2);
  const left = mergeSort(expenses.slice(0, mid), key, order);
  const right = mergeSort(expenses.slice(mid), key, order);

  return merge(left, right, key, order);
}

function merge(left, right, key, order) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    const a = getComparableValue(left[i], key);
    const b = getComparableValue(right[j], key);

    const shouldTakeLeft = order === "asc" ? a <= b : a >= b;

    if (shouldTakeLeft) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

function getComparableValue(expense, key) {
  if (key === "date") return new Date(expense.date).getTime();
  if (key === "amount") return expense.amount;
  return expense[key];
}

module.exports = { mergeSort };