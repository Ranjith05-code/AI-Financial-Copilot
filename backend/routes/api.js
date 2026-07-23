const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to AI Financial Copilot API 🚀");
});

module.exports = router;