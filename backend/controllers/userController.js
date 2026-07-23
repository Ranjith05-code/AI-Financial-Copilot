const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { getProfile, updateProfile, changePassword };