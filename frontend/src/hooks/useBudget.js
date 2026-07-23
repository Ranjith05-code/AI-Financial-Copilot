import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCache } from "../utils/cache";

import {
    getBudgets,
    createBudget,
} from "../services/budgetService";

const useBudget = () => {

    const [budgets, setBudgets] = useState(() => getCache("budgets")?.budgets || []);

    const [loading, setLoading] = useState(!getCache("budgets"));

    const fetchBudgets = async (signal) => {

        try {

            if (!getCache("budgets")) setLoading(true);

            const res = await getBudgets(signal);

            setBudgets(res.budgets || []);

        } catch (error) {

            if (error.name === "CanceledError" || error.name === "AbortError") return;

            console.error(error);

            toast.error("Failed to load budgets.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const controller = new AbortController();

        fetchBudgets(controller.signal);

        return () => controller.abort();

    }, []);

    const addBudget = async (budget) => {

        try {

            await createBudget(budget);

            toast.success("Budget created successfully.");

            await fetchBudgets();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to create budget."
            );
        }

    };

    return {

        budgets,

        loading,

        addBudget,

        fetchBudgets,

    };

};

export default useBudget;