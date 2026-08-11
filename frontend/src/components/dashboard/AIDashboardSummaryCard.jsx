import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/aiService";

const AIDashboardSummaryCard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const res = await getDashboardSummary();
                setSummary(res.summary);
            } catch (error) {
                console.error(error);
                setSummary({
                    todayInsight: "Your spending is steady. Keep an eye on discretionary categories.",
                    weeklyInsight: "Your week looks manageable. Consistency will help build savings.",
                    monthlyInsight: "A few focused adjustments could improve your budget position.",
                    recommendation: "Track your biggest recurring expenses before making changes.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadSummary();
    }, []);

    if (loading) return null;

    return (
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-950 to-slate-900 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">AI Dashboard Summary</h2>
                    <p className="mt-1 text-slate-400">Generated automatically for your current financial posture.</p>
                </div>
                <div className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-300">Auto-Generated</div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-900/70 p-4">
                    <h3 className="font-semibold text-white">Today</h3>
                    <p className="mt-2 text-sm text-slate-300">{summary?.todayInsight || "No insight available."}</p>
                </div>
                <div className="rounded-xl bg-slate-900/70 p-4">
                    <h3 className="font-semibold text-white">Weekly</h3>
                    <p className="mt-2 text-sm text-slate-300">{summary?.weeklyInsight || "No insight available."}</p>
                </div>
                <div className="rounded-xl bg-slate-900/70 p-4">
                    <h3 className="font-semibold text-white">Monthly</h3>
                    <p className="mt-2 text-sm text-slate-300">{summary?.monthlyInsight || "No insight available."}</p>
                </div>
                <div className="rounded-xl bg-slate-900/70 p-4">
                    <h3 className="font-semibold text-white">Recommendation</h3>
                    <p className="mt-2 text-sm text-slate-300">{summary?.recommendation || "No recommendation available."}</p>
                </div>
            </div>
        </div>
    );
};

export default AIDashboardSummaryCard;