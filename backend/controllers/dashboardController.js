const mongoose = require("mongoose");

const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Income = require("../models/Income");

const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user" });
        }

        const userObjectId = new mongoose.Types.ObjectId(
            /^[a-f\d]{24}$/i.exec(String(userId))[0]
        );

        // ==========================
        // Total Expenses
        // ==========================

        const totalExpenseResult = await Expense.aggregate([
            {
                $match: {
                    user: userObjectId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        const totalExpenses =
            totalExpenseResult.length > 0
                ? totalExpenseResult[0].total
                : 0;

        // ==========================
        // Total Transactions
        // ==========================

        const totalTransactions =
            await Expense.countDocuments({
                user: userObjectId,
            });

        // ==========================
        // Highest Expense
        // ==========================

        const highestExpense =
            await Expense.findOne({
                user: userObjectId,
            }).sort({
                amount: -1,
            });

        // ==========================
        // Category Breakdown
        // ==========================

        const categoryBreakdown =
            await Expense.aggregate([
                {
                    $match: {
                        user: userObjectId,
                    },
                },
                {
                    $group: {
                        _id: "$category",
                        amount: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        amount: -1,
                    },
                },
            ]);

        const formattedCategoryBreakdown =
            categoryBreakdown.map((item) => ({
                name: item._id,
                value: item.amount,
            }));

        const topCategory =
            categoryBreakdown.length > 0
                ? categoryBreakdown[0]._id
                : "N/A";

        // ==========================
        // Recent Transactions
        // ==========================

        const recentTransactions =
            await Expense.find({
                user: userObjectId,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(5);

        // ==========================
        // Monthly Expenses
        // ==========================

        const today = new Date();
        const currentYear =
            today.getFullYear();

        const currentMonthNumber =
            today.getMonth() + 1;

        const previousMonthNumber =
            currentMonthNumber === 1
                ? 12
                : currentMonthNumber - 1;

        const previousYear =
            currentMonthNumber === 1
                ? currentYear - 1
                : currentYear;

        const currentMonthStart = new Date(currentYear, currentMonthNumber - 1, 1);
        const currentMonthEnd = new Date(currentYear, currentMonthNumber, 0, 23, 59, 59, 999);
        const previousMonthStart = new Date(previousYear, previousMonthNumber - 1, 1);
        const previousMonthEnd = new Date(previousYear, previousMonthNumber, 0, 23, 59, 59, 999);

        const currentMonthExpenses = await Expense.find({
            user: userObjectId,
            date: {
                $gte: currentMonthStart,
                $lte: currentMonthEnd,
            },
        }).lean();

        const previousMonthExpenses = await Expense.find({
            user: userObjectId,
            date: {
                $gte: previousMonthStart,
                $lte: previousMonthEnd,
            },
        }).lean();

        const currentMonthTotal = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
        const previousMonthTotal = previousMonthExpenses.reduce((sum, item) => sum + item.amount, 0);

        const currentCategoryTotals = {};
        currentMonthExpenses.forEach((expense) => {
            currentCategoryTotals[expense.category] = (currentCategoryTotals[expense.category] || 0) + expense.amount;
        });

        const previousCategoryTotals = {};
        previousMonthExpenses.forEach((expense) => {
            previousCategoryTotals[expense.category] = (previousCategoryTotals[expense.category] || 0) + expense.amount;
        });

        const monthlyExpenses =
            await Expense.aggregate([
                {
                    $match: {
                        user: userObjectId,
                        date: {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lte: new Date(`${currentYear}-12-31`),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $month: "$date",
                        },
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const formattedMonthlyExpenses =
            monthNames.map((month, index) => {

                const found =
                    monthlyExpenses.find(
                        (item) => item._id === index + 1
                    );

                return {

                    month,

                    amount: found
                        ? found.total
                        : 0,

                };

            });

        // ==========================
        // Total Income
        // ==========================

        const incomeResult = await Income.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
        const netSavings = totalIncome - totalExpenses;

        // ==========================
        // Budget
        // ==========================

        const currentMonth =
            new Date().getMonth() + 1;

        const previousMonth =
            currentMonth === 1
                ? 12
                : currentMonth - 1;

        const previousBudgetYear =
            currentMonth === 1
                ? currentYear - 1
                : currentYear;

        const budgetData =
            await Budget.findOne({

                user: userObjectId,

                month: currentMonth,

                year: currentYear,

            });

        const previousBudgetData =
            await Budget.findOne({
                user: userObjectId,
                month: previousMonth,
                year: previousBudgetYear,
            });

        const budget =
            budgetData
                ? budgetData.amount
                : 0;

        const previousBudgetAmount =
            previousBudgetData
                ? previousBudgetData.amount
                : 0;

        const remainingBudget =
            budget - totalExpenses;

        // ==========================
        // Financial Health Score
        // ==========================

        let healthScore = 0;

        if (budget > 0) {

            const usage =
                (totalExpenses / budget) * 100;

            if (usage <= 70) {

                healthScore += 40;

            } else if (usage <= 90) {

                healthScore += 30;

            } else {

                healthScore += 10;

            }

        }

        if (totalTransactions >= 10) {

            healthScore += 20;

        } else {

            healthScore += 10;

        }

        if (categoryBreakdown.length >= 3) {

            healthScore += 20;

        } else {

            healthScore += 10;

        }

        if (remainingBudget > 0) {

            healthScore += 20;

        } else {

            healthScore += 5;

        }

        let healthStatus = "Poor";

        if (healthScore >= 90) {

            healthStatus = "Excellent";

        } else if (healthScore >= 75) {

            healthStatus = "Good";

        } else if (healthScore >= 60) {

            healthStatus = "Average";

        }

        // ==========================
        // Dashboard Notifications
        // ==========================

        const notifications = [];

        if (!budgetData && previousBudgetAmount > 0) {
            notifications.push({
                type: "info",
                title: "Monthly Budget Reset Needed",
                message: `Your budget for ${monthNames[currentMonth - 1]} is not set yet. You can reuse your previous month budget of ₹${previousBudgetAmount.toLocaleString("en-IN")} or set a new one manually.`,
                action: "rollover-budget",
                suggestedBudgetAmount: previousBudgetAmount,
                month: currentMonth,
                year: currentYear,
            });
        } else if (!budgetData) {
            notifications.push({
                type: "info",
                title: "Set Your Monthly Budget",
                message: `Your budget for ${monthNames[currentMonth - 1]} has not been configured yet. Set a monthly budget to start tracking your spending accurately.`,
            });
        }

        if (budget > 0) {
            const usage = (currentMonthTotal / budget) * 100;
            const remainingThisMonth = budget - currentMonthTotal;

            if (usage >= 100) {
                notifications.push({
                    type: "error",
                    title: "Budget Exceeded",
                    message: `You have exceeded your monthly budget by ₹${Math.abs(remainingThisMonth).toFixed(2)}.`,
                });
            } else if (usage >= 90) {
                notifications.push({
                    type: "warning",
                    title: "Budget Almost Exhausted",
                    message: "You have already used more than 90% of your monthly budget.",
                });
            } else if (remainingThisMonth <= budget * 0.15) {
                notifications.push({
                    type: "info",
                    title: "Low Remaining Budget",
                    message: `You have only ₹${Math.max(0, remainingThisMonth).toFixed(2)} left in your monthly budget.`,
                });
            } else if (usage <= 50) {
                notifications.push({
                    type: "success",
                    title: "Excellent Budget Control",
                    message: "Great job! You have used less than 50% of your monthly budget.",
                });
            }
        }

        if (currentMonthTotal > 0 && previousMonthTotal > 0) {
            const increasePercent = ((currentMonthTotal - previousMonthTotal) / Math.max(previousMonthTotal, 1)) * 100;

            if (increasePercent >= 25) {
                notifications.push({
                    type: "warning",
                    title: "Unusual Spending Increase",
                    message: `Your spending is up by ${Math.round(increasePercent)}% compared to last month.`,
                });
            }
        }

        const categorySpikeEntries = Object.entries(currentCategoryTotals).filter(([category, amount]) => {
            const previousAmount = previousCategoryTotals[category] || 0;
            return amount >= 2000 && previousAmount > 0 && amount > previousAmount * 1.35;
        });

        categorySpikeEntries.forEach(([category, amount]) => {
            const previousAmount = previousCategoryTotals[category] || 0;
            const increasePercent = ((amount - previousAmount) / Math.max(previousAmount, 1)) * 100;

            notifications.push({
                type: "warning",
                title: "Category Spending Spike",
                message: `${category} spending increased by ${Math.round(increasePercent)}% compared to last month.`,
            });
        });

        if (highestExpense && highestExpense.amount >= 5000) {
            notifications.push({
                type: "info",
                title: "Large Expense",
                message: `${highestExpense.title} cost ₹${highestExpense.amount}.`,
            });
        }

        // ==========================

        res.status(200).json({

            success: true,

            dashboard: {

                totalExpenses,

                totalTransactions,

                totalIncome,

                netSavings,

                budget,

                remainingBudget,

                highestExpense,

                topCategory,

                categoryBreakdown: formattedCategoryBreakdown,

                monthlyExpenses: formattedMonthlyExpenses,

                recentTransactions,

                healthScore,

                healthStatus,

                notifications,

            },

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

module.exports = {

    getDashboard,

};