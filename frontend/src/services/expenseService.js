import api from "./api";
import { getCache, setCache, clearCache } from "../utils/cache";

export const getExpenses = async (filters = {}, signal) => {
    const key = "expenses_" + JSON.stringify(filters);
    const cached = getCache(key);
    if (cached) return cached;
    const response = await api.get("/expenses", { params: filters, signal });
    setCache(key, response.data);
    return response.data;
};

export const addExpense = async (expenseData) => {
    const response = await api.post("/expenses", expenseData);
    clearCache("expenses_{}");
    return response.data;
};

const buildUrl = (base, id) => {
    const match = /^[a-f\d]{24}$/i.exec(String(id));
    if (!match) throw new Error("Invalid ID");
    const safeId = match[0].toLowerCase();
    const chars = safeId.split("");
    const validated = chars.filter(c => "0123456789abcdef".includes(c)).join("");
    if (validated.length !== 24) throw new Error("Invalid ID");
    return base + validated;
};

export const updateExpense = async (id, expenseData) => {
    const url = buildUrl("/expenses/", id);
    const response = await api.put(url, expenseData);
    clearCache("expenses_{}");
    return response.data;
};

export const deleteExpense = async (id) => {
    const url = buildUrl("/expenses/", id);
    const response = await api.delete(url);
    clearCache("expenses_{}");
    return response.data;
};

// ===========================
// Generate Recurring Expenses
// ===========================

export const generateRecurringExpenses = async () => {

    const response = await api.post(
        "/recurring/generate"
    );

    return response.data;

};