const RecurringExpense = require("../models/RecurringExpense");
const Expense = require("../models/Expense");

// ======================
// Create
// ======================

const createRecurringExpense = async (req, res) => {
    try {
        const recurring = await RecurringExpense.create({
            user: req.user.id,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            recurring,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ======================
// Get All
// ======================

const getRecurringExpenses = async (req, res) => {
    try {
        const recurring = await RecurringExpense.find({
            user: req.user.id,
        }).sort({
            nextDueDate: 1,
        });

        res.json({
            success: true,
            recurring,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ======================
// Update
// ======================

const updateRecurringExpense = async (req, res) => {
    try {
        const recurring = await RecurringExpense.findById(req.params.id);

        if (!recurring) {
            return res.status(404).json({
                success: false,
                message: "Recurring expense not found",
            });
        }

        if (recurring.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const updated = await RecurringExpense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.json({
            success: true,
            recurring: updated,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ======================
// Delete
// ======================

const deleteRecurringExpense = async (req, res) => {
    try {
        const recurring = await RecurringExpense.findById(req.params.id);

        if (!recurring) {
            return res.status(404).json({
                success: false,
                message: "Recurring expense not found",
            });
        }

        if (recurring.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await recurring.deleteOne();

        res.json({
            success: true,
            message: "Recurring expense deleted successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ======================
// Generate This Month
// ======================

const generateRecurringExpenses = async (req, res) => {
    try {
        const recurringExpenses = await RecurringExpense.find({
            user: req.user.id,
        });

        let generated = 0;

        const now = new Date();

        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        for (const recurring of recurringExpenses) {

            const alreadyExists = await Expense.findOne({
                user: req.user.id,
                title: recurring.title,
                amount: recurring.amount,
                category: recurring.category,
                date: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lt: new Date(currentYear, currentMonth + 1, 1),
                },
            });

            if (alreadyExists) {
                continue;
            }

            await Expense.create({
                user: req.user.id,
                title: recurring.title,
                amount: recurring.amount,
                category: recurring.category,
                date: new Date(),
            });

            generated++;
        }

        res.json({
            success: true,
            message: `${generated} recurring expenses generated successfully.`,
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
    createRecurringExpense,
    getRecurringExpenses,
    updateRecurringExpense,
    deleteRecurringExpense,
    generateRecurringExpenses,
};