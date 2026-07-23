import api from "./api";
import { getCache, setCache, clearCache } from "../utils/cache";

export const getGoal = async (signal) => {
    const cached = getCache("goals");
    if (cached) return cached;
    const res = await api.get("/goals", { signal });
    setCache("goals", res.data);
    return res.data;
};

export const createGoal = async (goal) => {
    const res = await api.post("/goals", goal);
    clearCache("goals");
    return res.data;
};

export const updateGoal = async (savedAmount) => {
    const res = await api.put("/goals", { savedAmount });
    clearCache("goals");
    return res.data;
};