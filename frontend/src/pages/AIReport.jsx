import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MonthlyAIReport from "./MonthlyAIReport";
import YearlyAIReport from "./YearlyAIReport";

const TABS = [
    { key: "monthly", label: "Monthly Report" },
    { key: "yearly", label: "Yearly Report" },
];

const AIReport = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname.includes("yearly") ? "yearly" : "monthly");

    useEffect(() => {
        setActiveTab(location.pathname.includes("yearly") ? "yearly" : "monthly");
    }, [location.pathname]);

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex flex-wrap gap-3">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                activeTab === tab.key
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "monthly" ? <MonthlyAIReport /> : <YearlyAIReport />}
        </div>
    );
};

export default AIReport;
