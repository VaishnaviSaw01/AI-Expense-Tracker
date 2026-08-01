/**
 * topExpenses.js
 * --------------
 * A binary Max-Heap used to efficiently find the top-N largest expenses.
 */

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftIndex(i) { return 2 * i + 1; }
  getRightIndex(i) { return 2 * i + 2; }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(expense) {
    this.heap.push(expense);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].amount >= this.heap[index].amount) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return max;
  }

  bubbleDown(index) {
    const n = this.heap.length;
    while (true) {
      const left = this.getLeftIndex(index);
      const right = this.getRightIndex(index);
      let largest = index;

      if (left < n && this.heap[left].amount > this.heap[largest].amount) largest = left;
      if (right < n && this.heap[right].amount > this.heap[largest].amount) largest = right;

      if (largest === index) break;
      this.swap(index, largest);
      index = largest;
    }
  }
}

function getTopNExpenses(expenses, n = 5) {
  const heap = new MaxHeap();
  for (const exp of expenses) heap.insert(exp);

  const top = [];
  const count = Math.min(n, expenses.length);
  for (let i = 0; i < count; i++) {
    top.push(heap.extractMax());
  }
  return top;
}

module.exports = { MaxHeap, getTopNExpenses };