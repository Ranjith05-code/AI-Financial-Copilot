const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const goalRoutes = require("./routes/goalRoutes");
const recurringExpenseRoutes = require("./routes/recurringExpenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");

// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/recurring", recurringExpenseRoutes);
app.use("/api/income", incomeRoutes);

// Default Route

app.get("/", (req, res) => {

    res.send("Welcome to AI Financial Copilot API 🚀");

});

// Start Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});