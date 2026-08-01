const Expense = require("../models/Expense");
const model = require("../config/gemini");
const { aggregateByCategory, aggregateByMonth, getTotalSpend } = require("../utils/dsa/aggregator");
const { getTopNExpenses } = require("../utils/dsa/topExpenses");

async function getInsights(req, res) {
  try {
    const expensesFromDb = await Expense.find().lean();
    const expenses = expensesFromDb.map((e) => ({ ...e, amount: Number(e.amount) }));

    if (expenses.length === 0) {
      return res.json({
        insight: {
          overview: "Add a few expenses first, then check back for insights.",
          optimize: "",
          recommendation: "",
        },
      });
    }

    const summary = {
      totalSpend: getTotalSpend(expenses),
      categoryTotals: aggregateByCategory(expenses),
      monthlyTotals: aggregateByMonth(expenses),
      topExpenses: getTopNExpenses(expenses, 3).map((e) => ({
        description: e.description,
        amount: e.amount,
        category: e.category,
      })),
    };

    const prompt = `You are a professional personal finance advisor reviewing a client's spending summary.

Based on the JSON summary below, respond with ONLY valid JSON (no markdown code fences, no explanation, no extra text) in exactly this shape:

{
  "overview": "1-2 sentences identifying the top spending category/categories and their share of total spend.",
  "optimize": "1-2 sentences naming a lower-priority/discretionary category (e.g. entertainment, dining out, shopping) where spend could be trimmed, with specific numbers.",
  "recommendation": "1-2 sentences giving one concrete, practical action tied to the data — e.g. if restaurant/dining spend is high, suggest cooking at home more and estimate savings; if entertainment is high, suggest a monthly cap."
}

Tone: professional, direct, like a financial advisor. No filler like "Great job." Use plain sentences, no markdown formatting, no asterisks.

Summary: ${JSON.stringify(summary)}`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    let insight;
    try {
      insight = JSON.parse(rawText);
    } catch (parseErr) {
      insight = { overview: rawText, optimize: "", recommendation: "" };
    }

    res.json({ insight, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getInsights };