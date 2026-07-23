import api from "./api";
import { getCache, setCache, clearCache } from "../utils/cache";

export const getBudgets = async (signal) => {
    const cached = getCache("budgets");
    if (cached) return cached;
    const res = await api.get("/budget", { signal });
    setCache("budgets", res.data);
    return res.data;
};

export const createBudget = async (budget) => {
    const res = await api.post("/budget", budget);
    clearCache("budgets");
    return res.data;
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

export const updateBudget = async (id, budget) => {
    const url = buildUrl("/budget/", id);
    const res = await api.put(url, budget);
    clearCache("budgets");
    return res.data;
};

export const deleteBudget = async (id) => {
    const url = buildUrl("/budget/", id);
    const res = await api.delete(url);
    clearCache("budgets");
    return res.data;
};