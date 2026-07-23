const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/emailService");

// ─── Step 1: Send OTP ────────────────────────────────────────────────────────
const sendOTP = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if already registered
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Remove any previous pending entry for this email
        await PendingUser.deleteMany({ email });

        // Save pending registration
        await PendingUser.create({ name, email, password: hashedPassword, otp, expiresAt });

        // Send OTP email — if this fails the email doesn't exist or is unreachable
        await sendOTPEmail(email, otp);

        res.status(200).json({ success: true, message: "Verification code sent to your email" });

    } catch (error) {
        console.error(error);

        if (error.code === "EAUTH" || error.code === "EENVELOPE" || error.code === "ECONNECTION" || error.responseCode >= 400) {
            return res.status(400).json({
                success: false,
                message: "Could not deliver email. Check your SMTP configuration or use a valid Gmail app password.",
            });
        }

        res.status(500).json({ success: false, message: "Failed to send verification code. Try again." });
    }
};

// ─── Step 2: Verify OTP & Create User ───────────────────────────────────────
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const pending = await PendingUser.findOne({ email });

        if (!pending) {
            return res.status(400).json({ success: false, message: "No pending registration found. Please register again." });
        }

        if (new Date() > pending.expiresAt) {
            await PendingUser.deleteOne({ email });
            return res.status(400).json({ success: false, message: "Verification code has expired. Please register again." });
        }

        if (pending.otp !== otp.trim()) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        // Create the real user
        const user = await User.create({
            name: pending.name,
            email: pending.email,
            password: pending.password,
        });

        // Clean up
        await PendingUser.deleteOne({ email });

        res.status(201).json({
            success: true,
            message: "Email verified. Account created successfully.",
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { sendOTP, verifyOTP, loginUser };
