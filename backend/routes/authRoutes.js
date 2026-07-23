const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, loginUser } = require("../controllers/authController");

router.post("/send-otp",   sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login",      loginUser);

module.exports = router;
