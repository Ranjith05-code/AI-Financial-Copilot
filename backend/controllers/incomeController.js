const Income = require("../models/Income");

const addIncome = async (req, res) => {
    try {
        const { title, amount, source, date } = req.body;
        if (!title || !amount || !source) {
            return res.status(400).json({ success: false, message: "Title, amount and source are required" });
        }
        const income = await Income.create({ user: req.user.id, title, amount, source, date });
        res.status(201).json({ success: true, message: "Income added successfully", income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
        const total = incomes.reduce((sum, i) => sum + i.amount, 0);
        res.status(200).json({ success: true, incomes, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ success: false, message: "Income not found" });
        if (income.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
        const updated = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: "Income updated successfully", income: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ success: false, message: "Income not found" });
        if (income.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
        await income.deleteOne();
        res.status(200).json({ success: true, message: "Income deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { addIncome, getIncomes, updateIncome, deleteIncome };
