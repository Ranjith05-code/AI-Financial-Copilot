import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { getSpendingPrediction } from "../services/aiService";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const AIForecast = () => {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadForecast = async () => {
            try {
                const res = await getSpendingPrediction();
                setForecast(res.prediction || res);
            } catch (error) {
                console.error(error);
                toast.error("Unable to load AI spending forecast.");
            } finally {
                setLoading(false);
            }
        };

        loadForecast();
    }, []);

    const recommendations = useMemo(() => {
        const predicted = Number(forecast?.expectedMonthEndSpending || 0);
        const chance = Number(forecast?.chanceOfExceedingBudget || 0);
        const remaining = Number(forecast?.expectedRemainingBudget || 0);

        const list = [];

        if (chance >= 60) {
            list.push("Reduce discretionary spending this week to protect your monthly budget.");
        }

        if (remaining < 0) {
            list.push("Pause large non-essential purchases until your next income cycle.");
        }

        if (predicted > 0) {
            list.push("Track your daily spending pace to stay close to the forecasted month-end target.");
        }

        if (!list.length) {
            list.push("Keep your current pace to stay within budget and build savings.");
        }

        return list;
    }, [forecast]);

    if (loading) {
        return <div className="text-slate-400">Loading AI spending forecast...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div>
                    <h1 className="text-3xl font-bold">AI Spending Forecast</h1>
                    <p className="mt-2 text-slate-400">
                        Forecast your expected month-end spending and budget risk with AI-powered insights.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">Forecast Summary</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="flex justify-between">
                            <span>Expected Spending Till End of Month</span>
                            <span>{formatCurrency(forecast?.expectedMonthEndSpending)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Budget Remaining</span>
                            <span>{formatCurrency(forecast?.expectedRemainingBudget)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Chance of Budget Exceeding</span>
                            <span>{Math.round(Number(forecast?.chanceOfExceedingBudget || 0))}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Expected Savings</span>
                            <span>{formatCurrency(forecast?.expectedSavings)}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">AI Explanation</h2>
                    <p className="mt-4 text-sm text-slate-300">
                        {forecast?.reasoning || "No AI explanation available yet."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">Recommendations</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                    {recommendations.map((item) => (
                        <div key={item} className="rounded-lg bg-slate-950 px-3 py-2">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIForecast;
