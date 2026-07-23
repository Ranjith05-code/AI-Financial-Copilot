const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getFinancialAdvice,
    chatWithAI,
} = require("../controllers/aiController");

router.get("/", protect, getFinancialAdvice);

router.post("/chat", protect, chatWithAI);

module.exports = router;