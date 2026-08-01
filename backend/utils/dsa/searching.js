/**
 * searching.js
 * ------------
 * Binary Search over an ALREADY SORTED (by date) expense array.
 * Time Complexity: O(log n) per boundary lookup vs O(n) for a linear scan.
 */

function binarySearchLeftBoundary(sortedExpenses, targetTime) {
  let low = 0;
  let high = sortedExpenses.length - 1;
  let result = sortedExpenses.length;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midTime = new Date(sortedExpenses[mid].date).getTime();

    if (midTime >= targetTime) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return result;
}

function binarySearchRightBoundary(sortedExpenses, targetTime) {
  let low = 0;
  let high = sortedExpenses.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midTime = new Date(sortedExpenses[mid].date).getTime();

    if (midTime <= targetTime) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}

function searchByDateRange(sortedExpenses, startDate, endDate) {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  const startIdx = binarySearchLeftBoundary(sortedExpenses, startTime);
  const endIdx = binarySearchRightBoundary(sortedExpenses, endTime);

  if (startIdx > endIdx) return [];
  return sortedExpenses.slice(startIdx, endIdx + 1);
}

module.exports = { searchByDateRange, binarySearchLeftBoundary, binarySearchRightBoundary };