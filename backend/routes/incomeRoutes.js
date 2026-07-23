const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { addIncome, getIncomes, updateIncome, deleteIncome } = require("../controllers/incomeController");

router.use(protect);
router.get("/", getIncomes);
router.post("/", addIncome);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
