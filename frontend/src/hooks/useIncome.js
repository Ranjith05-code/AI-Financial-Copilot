import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCache } from "../utils/cache";
import { getIncomes, addIncome, updateIncome, deleteIncome } from "../services/incomeService";

const useIncome = () => {
    const [incomes, setIncomes] = useState(() => getCache("incomes")?.incomes || []);
    const [total, setTotal] = useState(() => getCache("incomes")?.total || 0);
    const [loading, setLoading] = useState(!getCache("incomes"));

    const fetchIncomes = async (signal) => {
        try {
            if (!getCache("incomes")) setLoading(true);
            const res = await getIncomes(signal);
            setIncomes(res.incomes || []);
            setTotal(res.total || 0);
        } catch (error) {
            if (error.name === "CanceledError" || error.name === "AbortError") return;
            console.error(error);
            toast.error("Failed to load income.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchIncomes(controller.signal);
        return () => controller.abort();
    }, []);

    const createIncome = async (data) => {
        try {
            await addIncome(data);
            toast.success("Income added successfully.");
            await fetchIncomes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add income.");
        }
    };

    const editIncome = async (id, data) => {
        try {
            await updateIncome(id, data);
            toast.success("Income updated successfully.");
            await fetchIncomes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update income.");
        }
    };

    const removeIncome = async (id) => {
        try {
            await deleteIncome(id);
            toast.success("Income deleted successfully.");
            await fetchIncomes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete income.");
        }
    };

    return { incomes, total, loading, createIncome, editIncome, removeIncome };
};

export default useIncome;
