const asyncHandler = require("../utils/asyncHandler");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

const {
    generateFinancialAdvice,
    askFinancialQuestion,
} = require("../services/aiService");

const prepareFinancialData = async (userId) => {

    const expenses = await Expense.find({ user: userId });

    const budgets = await Budget.find({ user: userId });

    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const categoryTotals = {};

    expenses.forEach((expense) => {

        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) +
            expense.amount;

    });

    let topCategory = "N/A";
    let highest = 0;

    for (const category in categoryTotals) {

        if (categoryTotals[category] > highest) {

            highest = categoryTotals[category];
            topCategory = category;

        }

    }

    const budget =
        budgets.length > 0
            ? budgets[0].amount
            : 0;

    const today = new Date();

    const currentDay = today.getDate();

    const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();

    const remainingDays =
        daysInMonth - currentDay;

    const averageDailySpending =
        currentDay > 0
            ? totalExpenses / currentDay
            : 0;

    const predictedMonthEndSpending =
        averageDailySpending * daysInMonth;

    const predictedRemainingBudget =
        budget - predictedMonthEndSpending;

    const forecastStatus =
        predictedRemainingBudget >= 0
            ? "Within Budget"
            : "Budget Likely to Exceed";

    return {

        currency: "Indian Rupees (INR)",

        totalExpenses,

        totalTransactions: expenses.length,

        budget,

        remainingBudget: budget - totalExpenses,

        topCategory,

        categoryTotals,

        // Forecast

        currentDay,

        daysInMonth,

        remainingDays,

        averageDailySpending:
            Number(
                averageDailySpending.toFixed(2)
            ),

        predictedMonthEndSpending:
            Number(
                predictedMonthEndSpending.toFixed(2)
            ),

        predictedRemainingBudget:
            Number(
                predictedRemainingBudget.toFixed(2)
            ),

        forecastStatus,

    };

};

const getFinancialAdvice = asyncHandler(async (req, res) => {

    const financialData =
        await prepareFinancialData(
            req.user.id
        );

    const advice =
        await generateFinancialAdvice(
            financialData
        );

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

        throw new Error(
            "Question is required."
        );

    }

    const financialData =
        await prepareFinancialData(
            req.user.id
        );

    const answer =
        await askFinancialQuestion(
            financialData,
            question
        );

    res.json({

        success: true,

        question,

        answer,

    });

});

module.exports = {

    getFinancialAdvice,

    chatWithAI,

};