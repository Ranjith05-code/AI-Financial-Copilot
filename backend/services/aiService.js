const axios = require("axios");

const {
    buildFinancialPrompt,
    buildChatPrompt,
    buildCategoryPredictionPrompt,
    buildReceiptScanningPrompt,
    buildMonthlyReportPrompt,
    buildYearlyReportPrompt,
    buildSpendingPredictionPrompt,
    buildBudgetPlanPrompt,
    buildDashboardSummaryPrompt,
    buildGoalPlanPrompt,
} = require("../utils/promptBuilder");

const predictionCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const normalizeCategory = (value) => {
    const category = String(value || "").trim().toLowerCase();

    if (["food", "restaurant", "restaurant bill", "dining", "grocery"].includes(category)) return "Food";
    if (["transport", "travel", "fuel", "cab", "uber", "ola", "metro", "bus", "train"].includes(category)) return "Transport";
    if (["shopping", "cloth", "clothes", "fashion", "apparel", "retail", "amazon", "flipkart", "market"].includes(category)) return "Shopping";
    if (["bill", "bills", "rent", "electricity", "water", "internet", "mobile", "emi", "insurance", "loan", "subscription"].includes(category)) return "Bills";
    if (["entertainment", "movie", "streaming", "game", "party", "concert"].includes(category)) return "Entertainment";
    if (["health", "doctor", "medicine", "pharmacy", "hospital"].includes(category)) return "Health";
    if (["education", "course", "school", "college", "book", "stationery", "exam", "tuition"].includes(category)) return "Education";
    if (["investment", "mutual", "sip", "fd", "ppf", "stock", "trading", "crypto"].includes(category)) return "Investment";
    if (["salary", "income", "pay", "bonus", "refund", "freelance", "commission"].includes(category)) return "Salary";

    return "Other";
};

const normalizeExpenseType = (value) => {
    const expenseType = String(value || "").trim().toLowerCase();

    if (["dining", "restaurant", "food", "grocery"].includes(expenseType)) return "Dining";
    if (["fuel", "transport", "travel", "ride", "cab"].includes(expenseType)) return "Travel";
    if (["shopping", "fashion", "apparel", "retail"].includes(expenseType)) return "Shopping";
    if (["bill", "bills", "rent", "subscription"].includes(expenseType)) return "Bills";
    if (["health", "medicine", "doctor", "pharmacy", "hospital"].includes(expenseType)) return "Healthcare";
    if (["movie", "concert", "party", "streaming", "entertainment"].includes(expenseType)) return "Entertainment";
    if (["education", "school", "course", "tuition"].includes(expenseType)) return "Education";
    if (["investment", "stock", "sip", "mutual", "fd"].includes(expenseType)) return "Investment";
    if (["salary", "income", "bonus", "commission"].includes(expenseType)) return "Salary";

    return "Other";
};

const getHeuristicCategory = (title, description) => {
    const text = `${title || ""} ${description || ""}`.toLowerCase();

    if (/(salary|income|pay|bonus|freelance|commission|refund)/.test(text)) return "Salary";
    if (/(food|lunch|dinner|breakfast|coffee|restaurant|domino|pizza|swiggy|zomato|tea|snacks)/.test(text)) return "Food";
    if (/(train|bus|metro|fuel|cab|uber|ola|taxi|ride)/.test(text)) return "Transport";
    if (/(shopping|amazon|flipkart|cloth|shirt|shoe|electronics|gift|cosmetics|market)/.test(text)) return "Shopping";
    if (/(bill|rent|electric|water|internet|mobile|emi|insurance|loan|subscription|netflix|spotify|prime|hotstar)/.test(text)) return "Bills";
    if (/(doctor|medicine|hospital|health|clinic|pharmacy)/.test(text)) return "Health";
    if (/(movie|game|party|concert|streaming|entertainment|fun)/.test(text)) return "Entertainment";
    if (/(travel|flight|hotel|trip|bus|ticket)/.test(text)) return "Travel";
    if (/(course|education|book|school|college|exam|tuition|stationery)/.test(text)) return "Education";
    if (/(investment|mutual|sip|fd|ppf|stock|crypto|trading)/.test(text)) return "Investment";

    return "Other";
};

const getHeuristicBudgetPlan = (planInput) => {
    const monthlyIncome = Number(planInput.monthlyIncome || 0);
    const age = Number(planInput.age || 0);
    const lifestyle = String(planInput.lifestyle || "balanced").toLowerCase();

    const baseFood = Math.max(1000, monthlyIncome * 0.2);
    const baseBills = Math.max(5000, monthlyIncome * 0.2);
    const baseTransport = Math.max(1500, monthlyIncome * 0.08);
    const baseEntertainment = Math.max(1200, monthlyIncome * 0.07);
    const baseShopping = Math.max(1000, monthlyIncome * 0.06);
    const emergencyFund = Math.max(2000, monthlyIncome * 0.1);
    const savings = Math.max(1500, monthlyIncome * 0.12);
    const investment = Math.max(1000, monthlyIncome * 0.08);

    if (age > 30) {
        return {
            Food: baseFood,
            Bills: baseBills + 2000,
            Transport: baseTransport,
            Entertainment: Math.max(1000, baseEntertainment - 500),
            Shopping: Math.max(1000, baseShopping - 300),
            "Emergency Fund": emergencyFund + 1000,
            Savings: savings + 1000,
            Investment: investment + 1000,
            notes: "A more conservative plan is suitable for this stage of life.",
        };
    }

    if (lifestyle.includes("luxury")) {
        return {
            Food: baseFood + 3000,
            Bills: baseBills + 1500,
            Transport: baseTransport + 1000,
            Entertainment: baseEntertainment + 2000,
            Shopping: baseShopping + 2000,
            "Emergency Fund": emergencyFund + 500,
            Savings: savings,
            Investment: investment,
            notes: "Luxury lifestyle requires tighter controls in discretionary spending.",
        };
    }

    return {
        Food: baseFood,
        Bills: baseBills,
        Transport: baseTransport,
        Entertainment: baseEntertainment,
        Shopping: baseShopping,
        "Emergency Fund": emergencyFund,
        Savings: savings,
        Investment: investment,
        notes: "A balanced plan that keeps emergency savings and future investing strong.",
    };
};

const getHeuristicReport = (reportData) => ({
    executiveSummary: `You spent ₹${Number(reportData.totalExpenses || 0).toLocaleString("en-IN")} this month. ${reportData.topCategory ? `Your biggest focus was ${reportData.topCategory}.` : "Your spending is still in a healthy range."}`,
    financialHealth: reportData.healthScore >= 80 ? "Your position is healthy and you have room to build savings." : "Your spending is slightly elevated, so tighter control will help improve resilience.",
    topSpendingCategories: [reportData.topCategory || "Other"],
    spendingPattern: "Your spending is concentrated in a few categories, making targeted cuts more impactful.",
    goodHabits: ["You maintained a clear spending base.", "Your budget remained coherent across the month."],
    badHabits: ["Discretionary spending may creep up on weekends.", "Impulse purchases can add pressure to the monthly budget."],
    budgetAnalysis: reportData.remainingBudget >= 0 ? "You still have budget room left for the month." : "You are already under pressure and should trim non-essential spend.",
    savingsOpportunities: ["Increase automated savings transfers.", "Reduce one recurring discretionary category this month."],
    riskFactors: ["Unexpected bills", "Lifestyle inflation"],
    recommendations: ["Keep a weekly check on your largest categories.", "Set an automatic transfer to your savings account."],
});

const getHeuristicPrediction = (predictionData) => ({
    expectedMonthEndSpending: Number(predictionData.predictedMonthEndSpending || 0),
    chanceOfExceedingBudget: predictionData.budget > 0 && predictionData.predictedMonthEndSpending > predictionData.budget ? 75 : 35,
    expectedSavings: Math.max(0, Number(predictionData.savings || 0)),
    expectedRemainingBudget: Number(predictionData.predictedRemainingBudget || 0),
    reasoning: "The projection is based on your recent pace of spending and your current monthly budget balance.",
});

const getHeuristicDashboardSummary = (financialData) => ({
    todayInsight: "Your spending pace is stable today. Keep your discretionary purchases measured.",
    weeklyInsight: "Your weekly pattern looks manageable. A bit of consistency will improve your savings rate.",
    monthlyInsight: "You have a strong opportunity to protect your budget by trimming high-frequency spending.",
    budgetSummary: financialData.remainingBudget >= 0 ? "You still have room left in your monthly budget." : "Your spending is above the planned monthly budget.",
    savingsSummary: financialData.savings >= 0 ? "You are saving positively and can improve further with automation." : "Your savings need attention to stay healthy.",
    predictions: "The forecast suggests steady progress if you continue to monitor budget pressure closely.",
    recommendation: "Review your biggest recurring categories and move any excess into savings.",
});

const getHeuristicGoalPlan = (goalData) => {
    const targetAmount = Number(goalData.targetAmount || 0);
    const currentSavings = Number(goalData.currentSavings || 0);
    const remaining = Math.max(0, targetAmount - currentSavings);
    const monthly = remaining > 0 ? Math.max(1000, Math.ceil(remaining / 6)) : 0;

    return {
        monthlySavingPlan: monthly,
        weeklySavingPlan: Math.max(250, Math.ceil(monthly / 4)),
        expenseReductionPlan: "Trim one discretionary category each week and redirect the amount to your goal.",
        estimatedCompletion: remaining > 0 ? "Within the next 4 to 6 months if you stay consistent." : "You are already on track to meet the goal.",
        possibleRisks: ["Unexpected expenses", "Income variability"],
    };
};

const extractJson = (content) => {
    if (!content) return null;

    const trimmed = String(content).trim();

    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const candidate = fenced ? fenced[1] : trimmed;

    try {
        return JSON.parse(candidate);
    } catch (error) {
        const start = candidate.indexOf("{");
        const end = candidate.lastIndexOf("}");

        if (start >= 0 && end > start) {
            try {
                return JSON.parse(candidate.slice(start, end + 1));
            } catch (parseError) {
                return null;
            }
        }

        return null;
    }
};

const callGroq = async (prompt, maxTokens = 700) => {
    if (!process.env.GROQ_API_KEY) {
        return null;
    }

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: maxTokens,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Groq call failed:", error.message);
        return null;
    }
};

const generateFinancialAdvice = async (financialData) => {
    const prompt = buildFinancialPrompt(financialData);
    const answer = await callGroq(prompt);
    return answer || `Your current financial position is stable. Focus on reducing the biggest recurring spend categories and keep a steady savings transfer in place.`;
};

const askFinancialQuestion = async (financialData, question) => {
    const prompt = buildChatPrompt(financialData, question);
    const answer = await callGroq(prompt);
    return answer || `I can see your current financial snapshot, but the AI service is temporarily unavailable. Please review your budget, expenses, and savings targets manually for now.`;
};

const predictExpenseCategory = async (title, description, userId) => {
    const normalizedTitle = String(title || "").trim().toLowerCase();
    const normalizedDescription = String(description || "").trim().toLowerCase();
    const cacheKey = `${userId}:${normalizedTitle}:${normalizedDescription}`;

    const cached = predictionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.value;
    }

    const prompt = buildCategoryPredictionPrompt(title, description);
    const response = await callGroq(prompt, 400);
    const parsed = extractJson(response) || {};

    const fallbackTopCategories = ["Food", "Bills", "Transport"];
    const predictedCategory = normalizeCategory(parsed.predictedCategory || getHeuristicCategory(title, description));
    const merchant = String(parsed.merchant || title || "Unknown Merchant").trim() || "Unknown Merchant";
    const expenseType = normalizeExpenseType(parsed.expenseType || predictedCategory);
    const confidenceScore = Number(parsed.confidenceScore || parsed.confidence || 55);
    const topCategories = Array.isArray(parsed.topCategories) && parsed.topCategories.length
        ? parsed.topCategories.map((item) => normalizeCategory(item))
        : fallbackTopCategories;

    const result = {
        predictedCategory,
        merchant,
        expenseType,
        confidenceScore: Number(confidenceScore.toFixed(1)),
        topCategories,
        source: response ? "ai" : "heuristic",
    };

    predictionCache.set(cacheKey, { timestamp: Date.now(), value: result });
    return result;
};

const scanReceipt = async (receiptText, metadata = {}) => {
    const prompt = buildReceiptScanningPrompt(receiptText, metadata);
    const response = await callGroq(prompt, 600);
    const parsed = extractJson(response) || {};

    const amount = Number(parsed.amount || 0);
    const total = Number(parsed.total || amount || 0);
    const tax = Number(parsed.tax || 0);

    const fallbackItems = receiptText ? receiptText.split(/\n|,|;/).filter(Boolean).slice(0, 3) : [];

    const result = {
        merchant: parsed.merchant || metadata.fileName || "Scanned Merchant",
        amount: Number.isFinite(amount) ? amount : 0,
        date: parsed.date || new Date().toISOString().split("T")[0],
        items: Array.isArray(parsed.items) && parsed.items.length ? parsed.items : fallbackItems,
        tax: Number.isFinite(tax) ? tax : 0,
        total: Number.isFinite(total) ? total : 0,
        category: normalizeCategory(parsed.category || getHeuristicCategory(metadata.fileName || "", receiptText || "")),
        confidence: Number(parsed.confidence || 68),
        verified: Boolean(response),
    };

    return result;
};

const generateMonthlyReport = async (reportData) => {
    const prompt = buildMonthlyReportPrompt(reportData);
    const response = await callGroq(prompt, 800);
    const parsed = extractJson(response) || {};

    return {
        executiveSummary: parsed.executiveSummary || getHeuristicReport(reportData).executiveSummary,
        financialHealth: parsed.financialHealth || getHeuristicReport(reportData).financialHealth,
        topSpendingCategories: parsed.topSpendingCategories || getHeuristicReport(reportData).topSpendingCategories,
        spendingPattern: parsed.spendingPattern || getHeuristicReport(reportData).spendingPattern,
        goodHabits: parsed.goodHabits || getHeuristicReport(reportData).goodHabits,
        badHabits: parsed.badHabits || getHeuristicReport(reportData).badHabits,
        budgetAnalysis: parsed.budgetAnalysis || getHeuristicReport(reportData).budgetAnalysis,
        savingsOpportunities: parsed.savingsOpportunities || getHeuristicReport(reportData).savingsOpportunities,
        riskFactors: parsed.riskFactors || getHeuristicReport(reportData).riskFactors,
        recommendations: parsed.recommendations || getHeuristicReport(reportData).recommendations,
    };
};

const generateYearlyReport = async (reportData) => {
    const prompt = buildYearlyReportPrompt(reportData);
    const response = await callGroq(prompt, 900);
    const parsed = extractJson(response) || {};

    return {
        executiveSummary: parsed.executiveSummary || "Your yearly spending pattern shows stability with room for better budgeting discipline.",
        financialHealth: parsed.financialHealth || "Financial health is moderate and can improve with more consistent savings habits.",
        topSpendingCategories: parsed.topSpendingCategories || ["Food", "Bills", "Shopping"],
        monthlyTrendSummary: parsed.monthlyTrendSummary || "Your monthly spending remains stable with a few seasonal peaks.",
        goodHabits: parsed.goodHabits || ["You maintain regular savings activity.", "Your spending is comparatively well distributed."],
        badHabits: parsed.badHabits || ["Frequent discretionary spending may reduce savings.", "Budget adherence is inconsistent across months."],
        budgetAnalysis: parsed.budgetAnalysis || "Budget performance needs closer monitoring to keep annual savings goals on track.",
        savingsOpportunities: parsed.savingsOpportunities || ["Trim non-essential shopping", "Move part of the budget to an automated savings bucket"],
        riskFactors: parsed.riskFactors || ["Very high discretionary spending", "Low end-of-month savings buffer"],
        recommendations: parsed.recommendations || ["Review category limits monthly", "Automate a savings transfer each payday"],
    };
};

const generateSpendingPrediction = async (predictionData) => {
    const prompt = buildSpendingPredictionPrompt(predictionData);
    const response = await callGroq(prompt, 600);
    const parsed = extractJson(response) || {};

    const heuristic = getHeuristicPrediction(predictionData);

    return {
        expectedMonthEndSpending: Number(parsed.expectedMonthEndSpending || heuristic.expectedMonthEndSpending || 0),
        chanceOfExceedingBudget: Number(parsed.chanceOfExceedingBudget || heuristic.chanceOfExceedingBudget || 0),
        expectedSavings: Number(parsed.expectedSavings || heuristic.expectedSavings || 0),
        expectedRemainingBudget: Number(parsed.expectedRemainingBudget || heuristic.expectedRemainingBudget || 0),
        reasoning: parsed.reasoning || heuristic.reasoning,
    };
};

const generateBudgetPlan = async (planInput) => {
    const prompt = buildBudgetPlanPrompt(planInput);
    const response = await callGroq(prompt, 600);
    const parsed = extractJson(response) || {};

    const heuristic = getHeuristicBudgetPlan(planInput);

    return {
        Food: Number(parsed.Food || heuristic.Food || 0),
        Bills: Number(parsed.Bills || heuristic.Bills || 0),
        Transport: Number(parsed.Transport || heuristic.Transport || 0),
        Entertainment: Number(parsed.Entertainment || heuristic.Entertainment || 0),
        Shopping: Number(parsed.Shopping || heuristic.Shopping || 0),
        "Emergency Fund": Number(parsed["Emergency Fund"] || heuristic["Emergency Fund"] || 0),
        Savings: Number(parsed.Savings || heuristic.Savings || 0),
        Investment: Number(parsed.Investment || heuristic.Investment || 0),
        notes: parsed.notes || heuristic.notes,
    };
};

const generateDashboardSummary = async (financialData) => {
    const prompt = buildDashboardSummaryPrompt(financialData);
    const response = await callGroq(prompt, 600);
    const parsed = extractJson(response) || {};

    const heuristic = getHeuristicDashboardSummary(financialData);

    return {
        todayInsight: parsed.todayInsight || heuristic.todayInsight,
        weeklyInsight: parsed.weeklyInsight || heuristic.weeklyInsight,
        monthlyInsight: parsed.monthlyInsight || heuristic.monthlyInsight,
        budgetSummary: parsed.budgetSummary || heuristic.budgetSummary,
        savingsSummary: parsed.savingsSummary || heuristic.savingsSummary,
        predictions: parsed.predictions || heuristic.predictions,
        recommendation: parsed.recommendation || heuristic.recommendation,
    };
};

const generateGoalPlan = async (goalData) => {
    const prompt = buildGoalPlanPrompt(goalData);
    const response = await callGroq(prompt, 600);
    const parsed = extractJson(response) || {};

    const heuristic = getHeuristicGoalPlan(goalData);

    return {
        monthlySavingPlan: Number(parsed.monthlySavingPlan || heuristic.monthlySavingPlan || 0),
        weeklySavingPlan: Number(parsed.weeklySavingPlan || heuristic.weeklySavingPlan || 0),
        expenseReductionPlan: parsed.expenseReductionPlan || heuristic.expenseReductionPlan,
        estimatedCompletion: parsed.estimatedCompletion || heuristic.estimatedCompletion,
        possibleRisks: parsed.possibleRisks || heuristic.possibleRisks,
    };
};

module.exports = {
    generateFinancialAdvice,
    askFinancialQuestion,
    predictExpenseCategory,
    scanReceipt,
    generateMonthlyReport,
    generateYearlyReport,
    generateSpendingPrediction,
    generateBudgetPlan,
    generateDashboardSummary,
    generateGoalPlan,
};