const asyncHandler = require("../utils/asyncHandler");
const Budget = require("../models/Budget");

// ================================
// Create OR Update Budget
// ================================
const createBudget = asyncHandler(async (req, res) => {

    const { amount, month, year } = req.body;

    if (!amount || !month || !year) {
        res.status(400);
        throw new Error("Amount, month and year are required.");
    }

    let budget = await Budget.findOne({
        user: req.user.id,
        month,
        year,
    });

    // If budget already exists -> UPDATE IT
    if (budget) {

        budget.amount = amount;

        await budget.save();

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully.",
            budget,
        });

    }

    // Otherwise create new budget
    budget = await Budget.create({
        user: req.user.id,
        amount,
        month,
        year,
    });

    res.status(201).json({
        success: true,
        message: "Budget created successfully.",
        budget,
    });

});

// ================================
// Get All Budgets
// ================================
const getBudgets = asyncHandler(async (req, res) => {

    const budgets = await Budget.find({
        user: req.user.id,
    }).sort({
        year: -1,
        month: -1,
    });

    res.status(200).json({
        success: true,
        count: budgets.length,
        budgets,
    });

});

// ================================
// Update Budget
// ================================
const updateBudget = asyncHandler(async (req, res) => {

    const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!budget) {
        res.status(404);
        throw new Error("Budget not found.");
    }

    budget.amount = req.body.amount || budget.amount;

    await budget.save();

    res.status(200).json({
        success: true,
        message: "Budget updated successfully.",
        budget,
    });

});

// ================================
// Delete Budget
// ================================
const deleteBudget = asyncHandler(async (req, res) => {

    const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!budget) {
        res.status(404);
        throw new Error("Budget not found.");
    }

    await budget.deleteOne();

    res.status(200).json({
        success: true,
        message: "Budget deleted successfully.",
    });

});

module.exports = {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
};