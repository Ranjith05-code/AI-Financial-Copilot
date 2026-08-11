const asyncHandler = require("../utils/asyncHandler");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Income = require("../models/Income");

const {
    generateFinancialAdvice,
    askFinancialQuestion,
    predictExpenseCategory,
    scanReceipt,
    generateMonthlyReport,
    generateYearlyReport,
    generateSpendingPrediction,
    generateBudgetPlan,
    generateDashboardSummary,
    generateGoalPlan,
} = require("../services/aiService");

const prepareFinancialData = async (userId) => {
    const expenses = await Expense.find({ user: userId }).sort({ date: 1 });
    const budgets = await Budget.find({ user: userId }).sort({ year: -1, month: -1 });
    const incomes = await Income.find({ user: userId }).sort({ date: 1 });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    const categoryTotals = {};
    expenses.forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    let topCategory = "N/A";
    let highest = 0;

    for (const category in categoryTotals) {
        if (categoryTotals[category] > highest) {
            highest = categoryTotals[category];
            topCategory = category;
        }
    }

    const budget = budgets.length > 0 ? budgets[0].amount : 0;

    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - currentDay;
    const averageDailySpending = currentDay > 0 ? totalExpenses / currentDay : 0;
    const predictedMonthEndSpending = averageDailySpending * daysInMonth;
    const predictedRemainingBudget = budget - predictedMonthEndSpending;
    const forecastStatus = predictedRemainingBudget >= 0 ? "Within Budget" : "Budget Likely to Exceed";

    const monthlyTrend = Array.from({ length: 6 }, (_, index) => {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
        const monthExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === monthDate.getMonth() && expenseDate.getFullYear() === monthDate.getFullYear();
        });

        return {
            month: monthDate.toLocaleString("default", { month: "short" }),
            total: monthExpenses.reduce((sum, item) => sum + item.amount, 0),
        };
    });

    const savings = totalIncome - totalExpenses;

    return {
        currency: "Indian Rupees (INR)",
        totalExpenses,
        totalIncome,
        savings,
        totalTransactions: expenses.length,
        budget,
        remainingBudget: budget - totalExpenses,
        topCategory,
        categoryTotals,
        monthlyTrend,
        currentDay,
        daysInMonth,
        remainingDays,
        averageDailySpending: Number(averageDailySpending.toFixed(2)),
        predictedMonthEndSpending: Number(predictedMonthEndSpending.toFixed(2)),
        predictedRemainingBudget: Number(predictedRemainingBudget.toFixed(2)),
        forecastStatus,
        healthScore: Math.min(100, Math.max(0, Math.round(60 + (budget > 0 ? (budget - totalExpenses) / Math.max(1, budget) * 30 : 0) + (expenses.length >= 8 ? 10 : 0)))),
    };
};

const getFinancialAdvice = asyncHandler(async (req, res) => {
    const financialData = await prepareFinancialData(req.user.id);
    const advice = await generateFinancialAdvice(financialData);

    res.json({
        success: true,
        dashboardData: financialData,
        advice,
    });
});

const chatWithAI = asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question) {
        res.status(400);
        throw new Error("Question is required.");
    }

    const financialData = await prepareFinancialData(req.user.id);
    const answer = await askFinancialQuestion(financialData, question);

    res.json({
        success: true,
        question,
        answer,
    });
});

const predictCategory = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        res.status(400);
        throw new Error("Expense title is required.");
    }

    const prediction = await predictExpenseCategory(title, description, req.user.id);

    res.json({
        success: true,
        prediction,
    });
});

const scanReceiptHandler = asyncHandler(async (req, res) => {
    const { receiptText, fileName, saveExpense, category, title } = req.body;

    const extractedData = await scanReceipt(receiptText || "", { fileName });

    if (saveExpense) {
        const expense = await Expense.create({
            user: req.user.id,
            title: title || extractedData.merchant || "Scanned Expense",
            amount: Number(extractedData.total || extractedData.amount || 0),
            category: category || extractedData.category || "Other",
            date: extractedData.date || new Date(),
            notes: `Scanned receipt from ${extractedData.merchant || fileName || "unknown merchant"}`,
        });

        return res.json({
            success: true,
            extractedData,
            expense,
            message: "Receipt scanned and expense saved.",
        });
    }

    res.json({
        success: true,
        extractedData,
        message: "Receipt scanned successfully.",
    });
});

const getMonthlyReport = asyncHandler(async (req, res) => {
    const financialData = await prepareFinancialData(req.user.id);
    const report = await generateMonthlyReport(financialData);

    res.json({
        success: true,
        reportData: financialData,
        report,
    });
});

const getYearlyReport = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: 1 });
    const budgets = await Budget.find({ user: req.user.id }).sort({ year: -1, month: -1 });

    const now = new Date();
    const currentYear = now.getFullYear();
    const yearlyExpenses = expenses.filter((expense) => new Date(expense.date).getFullYear() === currentYear);
    const totalExpenses = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = budgets
        .filter((budget) => budget.year === currentYear)
        .reduce((sum, budget) => sum + budget.amount, 0);

    const monthlyTotals = Array.from({ length: 12 }, (_, monthIndex) => {
        const monthDate = new Date(currentYear, monthIndex, 1);
        const monthExpenses = yearlyExpenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === currentYear;
        });

        return {
            month: monthDate.toLocaleString("default", { month: "short" }),
            total: monthExpenses.reduce((sum, item) => sum + item.amount, 0),
        };
    });

    const categoryTotals = {};
    yearlyExpenses.forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";
    const lowestCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => a - b)[0]?.[0] || "N/A";

    const reportData = {
        totalExpenses,
        totalBudget,
        remainingBudget: totalBudget - totalExpenses,
        topCategory,
        lowestCategory,
        monthlyTrend: monthlyTotals,
        categoryTotals,
        healthScore: Math.max(0, Math.min(100, Math.round(60 + (totalBudget > 0 ? ((totalBudget - totalExpenses) / Math.max(1, totalBudget)) * 30 : 0)))),
    };

    const report = await generateYearlyReport(reportData);

    res.json({
        success: true,
        reportData,
        report,
    });
});

const getSpendingPrediction = asyncHandler(async (req, res) => {
    const financialData = await prepareFinancialData(req.user.id);
    const prediction = await generateSpendingPrediction(financialData);

    res.json({
        success: true,
        prediction,
    });
});

const getSmartBudgetPlan = asyncHandler(async (req, res) => {
    const budgetPlan = await generateBudgetPlan(req.body);

    res.json({
        success: true,
        budgetPlan,
    });
});

const getDashboardSummary = asyncHandler(async (req, res) => {
    const financialData = await prepareFinancialData(req.user.id);
    const summary = await generateDashboardSummary(financialData);

    res.json({
        success: true,
        summary,
    });
});

const getGoalPlan = asyncHandler(async (req, res) => {
    const { goal, targetAmount, deadline, currentSavings } = req.body;

    const plan = await generateGoalPlan({
        goal,
        targetAmount,
        deadline,
        currentSavings,
    });

    res.json({
        success: true,
        plan,
    });
});

module.exports = {
    getFinancialAdvice,
    chatWithAI,
    predictCategory,
    scanReceiptHandler,
    getMonthlyReport,
    getYearlyReport,
    getSpendingPrediction,
    getSmartBudgetPlan,
    getDashboardSummary,
    getGoalPlan,
};