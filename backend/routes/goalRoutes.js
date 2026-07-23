const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    createGoal,

    getGoal,

    updateGoal,

} = require("../controllers/goalController");

router.post("/", protect, createGoal);

router.get("/", protect, getGoal);

router.put("/", protect, updateGoal);

module.exports = router;