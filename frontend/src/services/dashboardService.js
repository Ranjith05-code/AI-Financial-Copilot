import api from "./api";
import { getCache, setCache } from "../utils/cache";

export const getDashboardData = async (signal) => {
    const cached = getCache("dashboard");
    if (cached) return cached;
    const response = await api.get("/dashboard", { signal });
    setCache("dashboard", response.data.dashboard);
    return response.data.dashboard;
};