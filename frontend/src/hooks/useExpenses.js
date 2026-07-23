import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCache } from "../utils/cache";

import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    generateRecurringExpenses,
} from "../services/expenseService";

const useExpenses = () => {

    const [expenses, setExpenses] = useState(() => getCache("expenses_{}")?.expenses || []);

    const [loading, setLoading] = useState(!getCache("expenses_{}"));

    const fetchExpenses = async (signal) => {

        try {

            if (!getCache("expenses_{}")) setLoading(true);

            const res = await getExpenses({}, signal);

            setExpenses(res.expenses || []);

        } catch (error) {

            if (error.name === "CanceledError" || error.name === "AbortError") return;

            console.error(error);

            toast.error("Failed to load expenses.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        const controller = new AbortController();

        fetchExpenses(controller.signal);

        return () => controller.abort();

    }, []);

    const createExpense = async (expense) => {

        try {

            await addExpense(expense);

            toast.success("Expense added successfully.");

            await fetchExpenses();

        } catch (error) {

            console.error(error);

            toast.error("Failed to add expense.");

        }

    };

    const editExpense = async (id, expense) => {

        try {

            await updateExpense(id, expense);

            toast.success("Expense updated successfully.");

            await fetchExpenses();

        } catch (error) {

            console.error(error);

            toast.error("Failed to update expense.");

        }

    };

    const removeExpense = async (id) => {

        try {

            await deleteExpense(id);

            toast.success("Expense deleted successfully.");

            await fetchExpenses();

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete expense.");

        }

    };

    const generateRecurring = async () => {

        try {

            const res = await generateRecurringExpenses();

            toast.success(
                res.message || "Recurring expenses generated successfully."
            );

            await fetchExpenses();

            return res;

        } catch (error) {

            console.error(error);

            toast.error("Failed to generate recurring expenses.");

            throw error;

        }

    };

    return {

        expenses,

        loading,

        createExpense,

        editExpense,

        removeExpense,

        generateRecurring,

        fetchExpenses,

    };

};

export default useExpenses;