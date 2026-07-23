const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createRecurringExpense,
    getRecurringExpenses,
    updateRecurringExpense,
    deleteRecurringExpense,
    generateRecurringExpenses,
} = require("../controllers/recurringExpenseController");

router.post("/", protect, createRecurringExpense);

router.get("/", protect, getRecurringExpenses);

router.post("/generate", protect, generateRecurringExpenses);

router.put("/:id", protect, updateRecurringExpense);

router.delete("/:id", protect, deleteRecurringExpense);

module.exports = router;