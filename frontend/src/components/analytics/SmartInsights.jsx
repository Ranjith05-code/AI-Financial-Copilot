import { FaLightbulb, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const buildInsights = (dashboard, totalIncome) => {
    if (!dashboard) return [];
    const { totalExpenses, budget, remainingBudget, topCategory, categoryBreakdown, monthlyExpenses, totalTransactions } = dashboard;
    const insights = [];
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    const budgetUsage = budget > 0 ? (totalExpenses / budget) * 100 : 0;

    // Savings rate insight
    if (totalIncome > 0) {
        if (savingsRate >= 20) {
            insights.push({ type: "success", icon: <FaCheckCircle />, title: "Great Savings Rate", text: `You're saving ${savingsRate.toFixed(1)}% of your income. Financial experts recommend at least 20%.` });
        } else if (savingsRate > 0) {
            insights.push({ type: "warning", icon: <FaExclamationTriangle />, title: "Low Savings Rate", text: `Your savings rate is ${savingsRate.toFixed(1)}%. Try to reach 20% by reducing discretionary spending.` });
        } else {
            insights.push({ type: "error", icon: <FaExclamationTriangle />, title: "Spending Exceeds Income", text: `You're spending ₹${Math.abs(netSavings).toLocaleString()} more than you earn. Review your expenses immediately.` });
        }
    }

    // Budget usage insight
    if (budget > 0) {
        if (budgetUsage >= 100) {
            insights.push({ type: "error", icon: <FaExclamationTriangle />, title: "Budget Exceeded", text: `You've exceeded your budget by ₹${Math.abs(remainingBudget).toLocaleString()}. Consider revising your spending plan.` });
        } else if (budgetUsage >= 80) {
            insights.push({ type: "warning", icon: <FaExclamationTriangle />, title: "Approaching Budget Limit", text: `You've used ${budgetUsage.toFixed(0)}% of your budget with ₹${remainingBudget.toLocaleString()} remaining.` });
        } else {
            insights.push({ type: "success", icon: <FaCheckCircle />, title: "Budget on Track", text: `You've used ${budgetUsage.toFixed(0)}% of your budget. You have ₹${remainingBudget.toLocaleString()} left to spend.` });
        }
    }

    // Top category insight
    if (topCategory && categoryBreakdown?.length > 0) {
        const topAmount = categoryBreakdown.find(c => c.name === topCategory)?.value || 0;
        const topPct = totalExpenses > 0 ? ((topAmount / totalExpenses) * 100).toFixed(0) : 0;
        insights.push({ type: "info", icon: <FaInfoCircle />, title: `Highest Spend: ${topCategory}`, text: `${topCategory} accounts for ${topPct}% of your total expenses (₹${topAmount.toLocaleString()}).` });
    }

    // Monthly trend insight
    if (monthlyExpenses?.length >= 2) {
        const currentMonth = new Date().getMonth();
        const current = monthlyExpenses[currentMonth]?.amount || 0;
        const previous = monthlyExpenses[Math.max(0, currentMonth - 1)]?.amount || 0;
        if (previous > 0 && current > 0) {
            const change = (((current - previous) / previous) * 100).toFixed(1);
            if (current > previous) {
                insights.push({ type: "warning", icon: <FaExclamationTriangle />, title: "Spending Increased", text: `Your spending this month is ${change}% higher than last month (₹${current.toLocaleString()} vs ₹${previous.toLocaleString()}).` });
            } else {
                insights.push({ type: "success", icon: <FaCheckCircle />, title: "Spending Decreased", text: `Great job! Your spending this month is ${Math.abs(change)}% lower than last month.` });
            }
        }
    }

    // Transaction frequency
    if (totalTransactions < 5) {
        insights.push({ type: "info", icon: <FaLightbulb />, title: "Add More Transactions", text: "Track more expenses to get better insights and a more accurate financial health score." });
    }

    return insights;
};

const TYPE_STYLES = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    error:   "border-red-500/30   bg-red-500/10   text-red-400",
    info:    "border-blue-500/30  bg-blue-500/10  text-blue-400",
};

const SmartInsights = ({ dashboard, totalIncome }) => {
    const insights = buildInsights(dashboard, totalIncome);

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <FaLightbulb className="text-yellow-400" size={22} />
                <h2 className="text-2xl font-bold">Smart Insights</h2>
            </div>
            {insights.length === 0 ? (
                <p className="text-slate-400">Add income and expenses to generate personalized insights.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {insights.map((insight, i) => (
                        <div key={i} className={`border rounded-xl p-4 ${TYPE_STYLES[insight.type]}`}>
                            <div className="flex items-center gap-2 font-semibold mb-1">
                                {insight.icon}
                                {insight.title}
                            </div>
                            <p className="text-sm text-slate-300">{insight.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartInsights;
