import { useState } from "react";
import { toast } from "react-toastify";

import { getGoalPlan } from "../services/aiService";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const AISavingsPlanner = () => {
    const [form, setForm] = useState({
        goal: "Buy Laptop",
        targetAmount: "80000",
        deadline: "12 Months",
        currentSavings: "0",
    });
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await getGoalPlan(form);
            setPlan(res.plan || res);
        } catch (error) {
            console.error(error);
            toast.error("Unable to generate savings plan.");
        } finally {
            setLoading(false);
        }
    };

    const dailySaving = Math.max(0, Number(plan?.monthlySavingPlan || 0) / 30);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h1 className="text-3xl font-bold">AI Savings Planner</h1>
                <p className="mt-2 text-slate-400">
                    Set your savings goal and let AI recommend a realistic monthly, weekly, and daily plan.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="goal"
                            placeholder="Goal"
                            value={form.goal}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-800 p-3 outline-none"
                            required
                        />

                        <input
                            type="number"
                            name="targetAmount"
                            placeholder="Goal Amount"
                            value={form.targetAmount}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-800 p-3 outline-none"
                            required
                        />

                        <input
                            type="text"
                            name="deadline"
                            placeholder="Target Date / Deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-800 p-3 outline-none"
                            required
                        />

                        <input
                            type="number"
                            name="currentSavings"
                            placeholder="Current Savings"
                            value={form.currentSavings}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-800 p-3 outline-none"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
                            disabled={loading}
                        >
                            {loading ? "Generating Plan..." : "Generate Savings Plan"}
                        </button>
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">AI Savings Plan</h2>

                    {!plan ? (
                        <div className="mt-4 text-slate-400">
                            Enter your goal details to generate a personalized savings strategy.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3 text-sm text-slate-300">
                            <div className="flex justify-between">
                                <span>Monthly Saving</span>
                                <span>{formatCurrency(plan?.monthlySavingPlan)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Weekly Saving</span>
                                <span>{formatCurrency(plan?.weeklySavingPlan)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Daily Saving</span>
                                <span>{formatCurrency(dailySaving)}</span>
                            </div>
                            <div className="rounded-lg bg-slate-950 p-3">
                                <div className="font-semibold text-white">Expense Reduction Suggestions</div>
                                <p className="mt-1 text-slate-400">{plan?.expenseReductionPlan || "No suggestions available yet."}</p>
                            </div>
                            <div className="rounded-lg bg-slate-950 p-3">
                                <div className="font-semibold text-white">Estimated Completion</div>
                                <p className="mt-1 text-slate-400">{plan?.estimatedCompletion || "No estimate available yet."}</p>
                            </div>
                            <div className="rounded-lg bg-slate-950 p-3">
                                <div className="font-semibold text-white">Possible Risks</div>
                                <p className="mt-1 text-slate-400">{plan?.possibleRisks?.join(" • ") || "No risks available yet."}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISavingsPlanner;
