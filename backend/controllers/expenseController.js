const Expense = require("../models/Expense");
const { mergeSort } = require("../utils/dsa/sorting");
const { searchByDateRange } = require("../utils/dsa/searching");
const { aggregateByCategory, aggregateByMonth, getTotalSpend } = require("../utils/dsa/aggregator");
const { getUniqueCategories } = require("../utils/dsa/uniqueSet");
const { getTopNExpenses } = require("../utils/dsa/topExpenses");

async function createExpense(req, res) {
  try {
    const { description, category, amount, date } = req.body;
    const expense = await Expense.create({ description, category, amount, date });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getExpenses(req, res) {
  try {
    const { sortBy = "date", order = "desc", startDate, endDate } = req.query;

    const expensesFromDb = await Expense.find().lean();
    const expenses = expensesFromDb.map((e) => ({ ...e, amount: Number(e.amount) }));

    let sorted = mergeSort(expenses, sortBy, order);

    if (startDate && endDate) {
      const ascendingByDate = mergeSort(expenses, "date", "asc");
      sorted = searchByDateRange(ascendingByDate, startDate, endDate);
      if (order === "desc") sorted = sorted.reverse();
    }

    const analytics = {
      categoryTotals: aggregateByCategory(expenses),
      monthlyTotals: aggregateByMonth(expenses),
      totalSpend: getTotalSpend(expenses),
      uniqueCategories: getUniqueCategories(expenses),
      topExpenses: getTopNExpenses(expenses, 5),
    };

    res.json({ expenses: sorted, analytics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateExpense(req, res) {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Expense not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteExpense(req, res) {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };