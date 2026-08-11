import api from "./api";

export const getFinancialAdvice = async () => {
    const res = await api.get("/ai");
    return res.data;
};

export const chatWithAI = async (question) => {
    const res = await api.post("/ai/chat", { question });
    return res.data;
};

export const predictExpenseCategory = async (title, description) => {
    const res = await api.post("/ai/predict-category", { title, description });
    return res.data;
};

export const scanReceipt = async (payload) => {
    const res = await api.post("/ai/scan-receipt", payload);
    return res.data;
};

export const getMonthlyAIReport = async () => {
    const res = await api.get("/ai/monthly-report");
    return res.data;
};

export const getYearlyAIReport = async () => {
    const res = await api.get("/ai/yearly-report");
    return res.data;
};

export const getSpendingPrediction = async () => {
    const res = await api.get("/ai/spending-prediction");
    return res.data;
};

export const getSmartBudgetPlan = async (payload) => {
    const res = await api.post("/ai/smart-budget", payload);
    return res.data;
};

export const getDashboardSummary = async () => {
    const res = await api.get("/ai/dashboard-summary");
    return res.data;
};

export const getGoalPlan = async (payload) => {
    const res = await api.post("/ai/goal-plan", payload);
    return res.data;
};