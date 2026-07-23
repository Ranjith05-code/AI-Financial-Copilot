import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import BudgetCard from "../components/budget/BudgetCard";
import BudgetProgress from "../components/budget/BudgetProgress";
import BudgetHistory from "../components/budget/BudgetHistory";
import BudgetModal from "../components/budget/BudgetModal";
import { SkeletonCards } from "../components/common/Skeleton";
import SkeletonCard from "../components/common/Skeleton";

import useBudget from "../hooks/useBudget";
import { getDashboardData } from "../services/dashboardService";
import { getCache } from "../utils/cache";

const Budget = () => {
    const { budgets, loading: budgetLoading, addBudget } = useBudget();
    const [showModal, setShowModal] = useState(false);
    const [dashboard, setDashboard] = useState(() => getCache("dashboard"));
    const [dashLoading, setDashLoading] = useState(!getCache("dashboard"));

    useEffect(() => {
        const controller = new AbortController();
        const fetchDashboard = async () => {
            try {
                const res = await getDashboardData(controller.signal);
                setDashboard(res);
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") return;
                console.error(error);
                toast.error("Failed to load dashboard.");
            } finally {
                setDashLoading(false);
            }
        };
        fetchDashboard();
        return () => controller.abort();
    }, []);

    const handleSaveBudget = async (budgetData) => {
        try {
            await addBudget(budgetData);
            toast.success("Budget saved successfully.");
            setShowModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save budget.");
        }
    };

    const currentBudget = budgets.length > 0 ? budgets[0] : null;
    const loading = budgetLoading || dashLoading;

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Budget Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                    Set Budget
                </button>
            </div>

            {loading ? (
                <div className="space-y-8">
                    <SkeletonCards count={2} height="h-48" />
                    <SkeletonCard className="h-64" />
                </div>
            ) : (
                <>
                    <div className="grid lg:grid-cols-2 gap-8">
                        <BudgetCard budget={currentBudget} />
                        <BudgetProgress
                            budget={dashboard?.budget || 0}
                            remaining={dashboard?.remainingBudget || 0}
                            totalExpenses={dashboard?.totalExpenses || 0}
                        />
                    </div>
                    <div className="mt-8">
                        <BudgetHistory budgets={budgets} />
                    </div>
                </>
            )}

            <BudgetModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveBudget} />
        </>
    );
};

export default Budget;
