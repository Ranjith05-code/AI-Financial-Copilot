import { useEffect, useState } from "react";
import { getCache } from "../utils/cache";

import {
    getRecurringExpenses,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    generateRecurringExpenses,
} from "../services/recurringExpenseService";

const useRecurringExpenses = () => {

    const [recurringExpenses, setRecurringExpenses] = useState(() => getCache("recurring")?.recurring || []);

    const [loading, setLoading] = useState(!getCache("recurring"));

    const fetchRecurringExpenses = async (signal) => {

        try {

            if (!getCache("recurring")) setLoading(true);

            const res = await getRecurringExpenses(signal);

            setRecurringExpenses(res.recurring || []);

        } catch (error) {

            if (error.name === "CanceledError" || error.name === "AbortError") return;

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const controller = new AbortController();

        fetchRecurringExpenses(controller.signal);

        return () => controller.abort();

    }, []);

    const createRecurring = async (expense) => {

        await createRecurringExpense(expense);

        await fetchRecurringExpenses();

    };

    const updateRecurring = async (id, expense) => {

        await updateRecurringExpense(id, expense);

        await fetchRecurringExpenses();

    };

    const removeRecurring = async (id) => {

        await deleteRecurringExpense(id);

        await fetchRecurringExpenses();

    };

    const generateExpenses = async () => {

        await generateRecurringExpenses();

    };

    return {

        recurringExpenses,

        loading,

        createRecurring,

        updateRecurring,

        removeRecurring,

        generateExpenses,

        fetchRecurringExpenses,

    };

};

export default useRecurringExpenses;