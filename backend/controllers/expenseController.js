const Expense = require("../models/Expense");

// =========================
// Add Expense
// =========================

const addExpense = async (req, res) => {

    try {

        const {
            title,
            amount,
            category,
            date,
        } = req.body;

        if (!title || !amount || !category) {

            return res.status(400).json({

                success: false,

                message: "Title, amount and category are required",

            });

        }

        const expense = await Expense.create({

            user: req.user.id,

            title,

            amount,

            category,

            date,

        });

        res.status(201).json({

            success: true,

            message: "Expense added successfully",

            expense,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

// =========================
// Get Expenses + Filters
// =========================

const getExpenses = async (req, res) => {

    try {

        const {

            search,

            category,

            startDate,

            endDate,

        } = req.query;

        const filter = {

            user: req.user.id,

        };

        if (search) {

            filter.title = {

                $regex: search,

                $options: "i",

            };

        }

        if (

            category &&

            category !== "All"

        ) {

            filter.category = category;

        }

        if (

            startDate ||

            endDate

        ) {

            filter.date = {};

            if (startDate) {

                filter.date.$gte = new Date(startDate);

            }

            if (endDate) {

                filter.date.$lte = new Date(endDate);

            }

        }

        const expenses = await Expense.find(filter)

            .sort({

                date: -1,

            });

        res.status(200).json({

            success: true,

            count: expenses.length,

            expenses,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

// =========================
// Update Expense
// =========================

const updateExpense = async (req, res) => {

    try {

        const expense = await Expense.findById(req.params.id);

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found",

            });

        }

        if (

            expense.user.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Not authorized",

            });

        }

        const updatedExpense = await Expense.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true,

            }

        );

        res.status(200).json({

            success: true,

            message: "Expense updated successfully",

            expense: updatedExpense,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

// =========================
// Delete Expense
// =========================

const deleteExpense = async (req, res) => {

    try {

        const expense = await Expense.findById(req.params.id);

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found",

            });

        }

        if (

            expense.user.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Not authorized",

            });

        }

        await expense.deleteOne();

        res.status(200).json({

            success: true,

            message: "Expense deleted successfully",

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

};

module.exports = {

    addExpense,

    getExpenses,

    updateExpense,

    deleteExpense,

};