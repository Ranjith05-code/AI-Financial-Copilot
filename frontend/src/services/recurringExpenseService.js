import api from "./api";
import { getCache, setCache, clearCache } from "../utils/cache";

export const getRecurringExpenses = async (signal) => {
    const cached = getCache("recurring");
    if (cached) return cached;
    const res = await api.get("/recurring", { signal });
    setCache("recurring", res.data);
    return res.data;
};

export const createRecurringExpense = async (data) => {
    const res = await api.post("/recurring", data);
    clearCache("recurring");
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

export const updateRecurringExpense = async (id, data) => {
    const url = buildUrl("/recurring/", id);
    const res = await api.put(url, data);
    clearCache("recurring");
    return res.data;
};

export const deleteRecurringExpense = async (id) => {
    const url = buildUrl("/recurring/", id);
    const res = await api.delete(url);
    clearCache("recurring");
    return res.data;
};

export const generateRecurringExpenses = async () => {
    const res = await api.post("/recurring/generate");
    return res.data;
};