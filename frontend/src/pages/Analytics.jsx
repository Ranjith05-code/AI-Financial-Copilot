import { useEffect, useState } from "react";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsCards from "../components/analytics/AnalyticsCards";
import CategoryAnalysis from "../components/analytics/CategoryAnalysis";
import MonthlyAnalysis from "../components/analytics/MonthlyAnalysis";
import IncomeVsExpenseChart from "../components/analytics/IncomeVsExpenseChart";
import SmartInsights from "../components/analytics/SmartInsights";

import { getDashboardData } from "../services/dashboardService";
import { getIncomes } from "../services/incomeService";
import { getCache } from "../utils/cache";
import { SkeletonAnalytics } from "../components/common/Skeleton";

const Analytics = () => {
    const [dashboard, setDashboard] = useState(() => getCache("dashboard"));
    const [incomeData, setIncomeData] = useState(() => getCache("incomes"));
    const [loading, setLoading] = useState(!getCache("dashboard"));

    useEffect(() => {
        const controller = new AbortController();
        const fetch = async () => {
            try {
                const [dash, inc] = await Promise.all([
                    getDashboardData(controller.signal),
                    getIncomes(controller.signal),
                ]);
                setDashboard(dash);
                setIncomeData(inc);
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") return;
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
        return () => controller.abort();
    }, []);

    if (loading) return <SkeletonAnalytics />;

    return (
        <>
            <AnalyticsHeader />

            <AnalyticsCards
                totalExpenses={dashboard?.totalExpenses || 0}
                totalIncome={incomeData?.total || 0}
                budget={dashboard?.budget || 0}
                remainingBudget={dashboard?.remainingBudget || 0}
                topCategory={dashboard?.topCategory}
                netSavings={(incomeData?.total || 0) - (dashboard?.totalExpenses || 0)}
            />

            <div className="grid lg:grid-cols-2 gap-8 mt-8">
                <MonthlyAnalysis data={dashboard?.monthlyExpenses} />
                <CategoryAnalysis data={dashboard?.categoryBreakdown} />
            </div>

            <div className="mt-8">
                <IncomeVsExpenseChart
                    totalIncome={incomeData?.total || 0}
                    totalExpenses={dashboard?.totalExpenses || 0}
                    budget={dashboard?.budget || 0}
                />
            </div>

            <div className="mt-8">
                <SmartInsights
                    dashboard={dashboard}
                    totalIncome={incomeData?.total || 0}
                />
            </div>
        </>
    );
};

export default Analytics;
