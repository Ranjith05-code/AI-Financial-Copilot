const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        source: {
            type: String,
            required: true,
            enum: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"],
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
