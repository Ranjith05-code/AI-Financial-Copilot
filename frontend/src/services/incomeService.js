import api from "./api";
import { getCache, setCache, clearCache } from "../utils/cache";

export const getIncomes = async (signal) => {
    const cached = getCache("incomes");
    if (cached) return cached;
    const res = await api.get("/income", { signal });
    setCache("incomes", res.data);
    return res.data;
};

export const addIncome = async (data) => {
    const res = await api.post("/income", data);
    clearCache("incomes");
    clearCache("dashboard");
    return res.data;
};

const buildUrl = (base, id) => {
    const match = /^[a-f\d]{24}$/i.exec(String(id));
    if (!match) throw new Error("Invalid ID");
    return base + match[0].toLowerCase();
};

export const updateIncome = async (id, data) => {
    const res = await api.put(buildUrl("/income/", id), data);
    clearCache("incomes");
    clearCache("dashboard");
    return res.data;
};

export const deleteIncome = async (id) => {
    const res = await api.delete(buildUrl("/income/", id));
    clearCache("incomes");
    clearCache("dashboard");
    return res.data;
};
