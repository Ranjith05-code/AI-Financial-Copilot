import { useEffect, useMemo, useState } from "react";

import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardNotifications from "../components/dashboard/DashboardNotifications";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import FinancialHealthCard from "../components/dashboard/FinancialHealthCard";
import BudgetAlert from "../components/dashboard/BudgetAlert";
import AIInsightsCard from "../components/dashboard/AIInsightsCard";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import ExpenseBarChart from "../components/charts/ExpenseBarChart";
import RecentTransactions from "../components/tables/RecentTransactions";
import { SkeletonDashboard } from "../components/common/Skeleton";

import { getDashboardData } from "../services/dashboardService";
import { getCache } from "../utils/cache";

const RANGES = [
    { label: "This Month",    value: "month"   },
    { label: "Last 3 Months", value: "3months" },
    { label: "This Year",     value: "year"    },
    { label: "All Time",      value: "all"     },
];

const filterMonthlyData = (monthlyExpenses, range) => {
    if (!monthlyExpenses) return [];
    const currentMonth = new Date().getMonth();
    if (range === "month")   return monthlyExpenses.filter((_, i) => i === currentMonth);
    if (range === "3months") return monthlyExpenses.filter((_, i) => i >= Math.max(0, currentMonth - 2) && i <= currentMonth);
    if (range === "year")    return monthlyExpenses.filter((_, i) => i <= currentMonth);
    return monthlyExpenses;
};

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(() => getCache("dashboard"));
    const [loading, setLoading] = useState(!getCache("dashboard"));
    const [range, setRange] = useState("year");

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const data = await getDashboardData(controller.signal);
                setDashboard(data);
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") return;
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => controller.abort();
    }, []);

    const filteredMonthly = useMemo(
        () => filterMonthlyData(dashboard?.monthlyExpenses, range),
        [dashboard, range]
    );

    if (loading) return <SkeletonDashboard />;

    return (
        <>
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold">Financial Dashboard</h1>
                <div className="flex gap-2 flex-wrap">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setRange(r.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                range === r.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <DashboardCards dashboard={dashboard} />

            {dashboard && <DashboardNotifications notifications={dashboard.notifications} />}

            {dashboard && (
                <div className="grid lg:grid-cols-2 gap-6 mt-8">
                    <FinancialHealthCard score={dashboard.healthScore} status={dashboard.healthStatus} />
                    <BudgetProgress budget={dashboard.budget} remaining={dashboard.remainingBudget} />
                </div>
            )}

            {dashboard && (
                <div className="mt-8">
                    <BudgetAlert budget={dashboard.budget} remaining={dashboard.remainingBudget} />
                </div>
            )}

            {dashboard && (
                <div className="mt-8">
                    <AIInsightsCard dashboard={dashboard} />
                </div>
            )}

            {dashboard && (
                <div className="grid lg:grid-cols-2 gap-6 mt-8">
                    <ExpenseBarChart data={filteredMonthly} />
                    <CategoryPieChart data={dashboard.categoryBreakdown} />
                </div>
            )}

            {dashboard && (
                <div className="mt-8">
                    <RecentTransactions transactions={dashboard.recentTransactions} />
                </div>
            )}
        </>
    );
};

export default Dashboard;
