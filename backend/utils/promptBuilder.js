const buildFinancialPrompt = (financialData) => {
    return `
You are an expert AI Financial Advisor for users in India.

IMPORTANT RULES:
- Currency: Indian Rupees (INR)
- Never use USD or $
- Give practical advice.
- Keep answers concise.
- Use simple English.

Financial Data:

${JSON.stringify(financialData, null, 2)}
`;
};

const buildChatPrompt = (financialData, question) => {
    return `
You are an AI Financial Copilot.

User Currency:
Indian Rupees (₹)

Financial Data:

${JSON.stringify(financialData, null, 2)}

User Question:

${question}

Answer ONLY using the financial data above.

If information is unavailable, say:

"I don't have enough financial data to answer that."
`;
};

const buildCategoryPredictionPrompt = (title, description) => {
    return `
You are an AI expense categorization engine for a personal finance app.

Classify the expense into one of these categories:
Food, Transport, Shopping, Bills, Health, Entertainment, Travel, Education, Investment, Salary, Other.

Also infer:
- merchant: the store, brand, or business name mentioned in the title or description
- expenseType: a short business type such as Dining, Grocery, Fuel, Healthcare, Shopping, Entertainment, Education, Travel, Investment, Salary, Other

User input:
Title: ${title || "Untitled"}
Description: ${description || "No description provided"}

Return valid JSON only with this shape:
{
  "predictedCategory": "Category",
  "merchant": "Merchant name",
  "expenseType": "Expense Type",
  "confidenceScore": 0-100,
  "topCategories": ["Category 1", "Category 2", "Category 3"]
}

If the title is clearly salary or income, return Salary or Investment.
`;
};

const buildReceiptScanningPrompt = (receiptText, metadata = {}) => {
    return `
You are an AI receipt and invoice extractor for an Indian finance app.

Extract the following from the receipt text or uploaded document:
- merchant
- amount
- date
- items
- tax
- total
- category

Receipt text / document context:
${receiptText || "No text available"}

Additional metadata:
${JSON.stringify(metadata, null, 2)}

Return valid JSON only with this shape:
{
  "merchant": "",
  "amount": 0,
  "date": "YYYY-MM-DD",
  "items": ["item 1", "item 2"],
  "tax": 0,
  "total": 0,
  "category": "Food",
  "confidence": 0-100
}
`;
};

const buildMonthlyReportPrompt = (reportData) => {
    return `
You are an AI financial report generator for an Indian user.

Create a concise professional monthly report using this financial data:
${JSON.stringify(reportData, null, 2)}

Return valid JSON only with this shape:
{
  "executiveSummary": "",
  "financialHealth": "",
  "topSpendingCategories": [""],
  "spendingPattern": "",
  "goodHabits": [""],
  "badHabits": [""],
  "budgetAnalysis": "",
  "savingsOpportunities": [""],
  "riskFactors": [""],
  "recommendations": [""]
}
`;
};

const buildYearlyReportPrompt = (reportData) => {
    return `
You are an AI yearly financial report generator for an Indian user.

Create a concise professional yearly report using this financial data:
${JSON.stringify(reportData, null, 2)}

Return valid JSON only with this shape:
{
  "executiveSummary": "",
  "financialHealth": "",
  "topSpendingCategories": [""],
  "monthlyTrendSummary": "",
  "goodHabits": [""],
  "badHabits": [""],
  "budgetAnalysis": "",
  "savingsOpportunities": [""],
  "riskFactors": [""],
  "recommendations": [""]
}
`;
};

const buildSpendingPredictionPrompt = (predictionData) => {
    return `
You are an AI spending forecaster for a finance app.

Analyze the user's historical spending and forecast the month-end outlook.

Data:
${JSON.stringify(predictionData, null, 2)}

Return valid JSON only with this shape:
{
  "expectedMonthEndSpending": 0,
  "chanceOfExceedingBudget": 0,
  "expectedSavings": 0,
  "expectedRemainingBudget": 0,
  "reasoning": ""
}
`;
};

const buildBudgetPlanPrompt = (planInput) => {
    return `
You are an AI budget planner for a personal finance app.

Create a monthly budget plan using the following data:
${JSON.stringify(planInput, null, 2)}

Return valid JSON only with this shape:
{
  "Food": 0,
  "Bills": 0,
  "Transport": 0,
  "Entertainment": 0,
  "Shopping": 0,
  "Emergency Fund": 0,
  "Savings": 0,
  "Investment": 0,
  "notes": ""
}
`;
};

const buildDashboardSummaryPrompt = (financialData) => {
    return `
You are an AI dashboard summarizer for a financial copilot.

Summarize the user's financial status in a useful and concise way.

Data:
${JSON.stringify(financialData, null, 2)}

Return valid JSON only with this shape:
{
  "todayInsight": "",
  "weeklyInsight": "",
  "monthlyInsight": "",
  "budgetSummary": "",
  "savingsSummary": "",
  "predictions": "",
  "recommendation": ""
}
`;
};

const buildGoalPlanPrompt = (goalData) => {
    return `
You are an AI goal planner for a personal finance app.

Create a practical plan for the user to achieve this financial goal.

Data:
${JSON.stringify(goalData, null, 2)}

Return valid JSON only with this shape:
{
  "monthlySavingPlan": 0,
  "weeklySavingPlan": 0,
  "expenseReductionPlan": "",
  "estimatedCompletion": "",
  "possibleRisks": [""]
}
`;
};

module.exports = {
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
};