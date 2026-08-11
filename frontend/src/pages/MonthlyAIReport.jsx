import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { getMonthlyAIReport } from "../services/aiService";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const MonthlyAIReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReport = async () => {
            try {
                const res = await getMonthlyAIReport();
                setReport(res);
            } catch (error) {
                console.error(error);
                toast.error("Unable to load AI report.");
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, []);

    const sections = useMemo(() => [
        { title: "Executive Summary", value: report?.report?.executiveSummary },
        { title: "Financial Health", value: report?.report?.financialHealth },
        { title: "Top Spending Categories", value: report?.report?.topSpendingCategories?.join(", ") },
        { title: "Spending Pattern", value: report?.report?.spendingPattern },
        { title: "Good Habits", value: report?.report?.goodHabits?.join(" • ") },
        { title: "Bad Habits", value: report?.report?.badHabits?.join(" • ") },
        { title: "Budget Analysis", value: report?.report?.budgetAnalysis },
        { title: "Savings Opportunities", value: report?.report?.savingsOpportunities?.join(" • ") },
        { title: "Risk Factors", value: report?.report?.riskFactors?.join(" • ") },
        { title: "Recommendations", value: report?.report?.recommendations?.join(" • ") },
    ], [report]);

    const budgetUsage = Math.min(100, Math.round(((Number(report?.reportData?.totalExpenses || 0) / Math.max(Number(report?.reportData?.budget || 0), 1)) * 100)));
    const lowestCategory = useMemo(() => {
        const categoryTotals = report?.reportData?.categoryTotals || {};
        const entries = Object.entries(categoryTotals).sort(([, a], [, b]) => a - b);
        return entries.length ? entries[0][0] : "N/A";
    }, [report]);

    const handleDownloadReport = () => {
        if (!report?.report) {
            toast.error("No report available to download yet.");
            return;
        }

        const doc = new jsPDF();
        const reportData = report.report;

        doc.setFontSize(18);
        doc.text("Monthly AI Report", 14, 16);
        doc.setFontSize(10);
        doc.text("Generated from your AI financial insights", 14, 23);

        autoTable(doc, {
            startY: 30,
            head: [["Metric", "Value"]],
            body: [
                ["Total Expenses", `₹${Number(report?.reportData?.totalExpenses || 0).toLocaleString("en-IN")}`],
                ["Budget", `₹${Number(report?.reportData?.budget || 0).toLocaleString("en-IN")}`],
                ["Remaining Budget", `₹${Number(report?.reportData?.remainingBudget || 0).toLocaleString("en-IN")}`],
                ["Top Category", report?.reportData?.topCategory || "N/A"],
                ["Health Score", `${report?.reportData?.healthScore || 0}/100`],
            ],
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [15, 23, 42] },
        });

        let currentY = doc.lastAutoTable.finalY + 10;
        const insightBlocks = [
            { title: "Executive Summary", value: reportData.executiveSummary },
            { title: "Financial Health", value: reportData.financialHealth },
            { title: "Top Spending Categories", value: reportData.topSpendingCategories?.join(", ") },
            { title: "Spending Pattern", value: reportData.spendingPattern },
            { title: "Good Habits", value: reportData.goodHabits?.join(" • ") },
            { title: "Bad Habits", value: reportData.badHabits?.join(" • ") },
            { title: "Budget Analysis", value: reportData.budgetAnalysis },
            { title: "Savings Opportunities", value: reportData.savingsOpportunities?.join(" • ") },
            { title: "Risk Factors", value: reportData.riskFactors?.join(" • ") },
            { title: "Recommendations", value: reportData.recommendations?.join(" • ") },
        ];

        insightBlocks.forEach((section) => {
            const lines = doc.splitTextToSize(`${section.title}: ${section.value || "No insight available yet."}`, 180);
            if (currentY + lines.length * 5 > 280) {
                doc.addPage();
                currentY = 16;
            }

            doc.setFont("helvetica", "bold");
            doc.text(section.title, 14, currentY);
            currentY += 6;
            doc.setFont("helvetica", "normal");
            doc.text(lines, 14, currentY);
            currentY += lines.length * 5 + 6;
        });

        doc.save("monthly-ai-report.pdf");
        toast.success("Monthly AI report downloaded as PDF.");
    };

    if (loading) {
        return <div className="text-slate-400">Generating your AI monthly report...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Monthly AI Report</h1>
                        <p className="mt-2 text-slate-400">A professional, AI-generated view of your month with actionable insight.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDownloadReport}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">Key Metrics</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="flex justify-between"><span>Total Spending</span><span>{formatCurrency(report?.reportData?.totalExpenses)}</span></div>
                        <div className="flex justify-between"><span>Highest Spending Category</span><span>{report?.reportData?.topCategory || "N/A"}</span></div>
                        <div className="flex justify-between"><span>Lowest Spending Category</span><span>{lowestCategory}</span></div>
                        <div className="flex justify-between"><span>Budget Usage</span><span>{budgetUsage}%</span></div>
                        <div className="flex justify-between"><span>Budget</span><span>{formatCurrency(report?.reportData?.budget)}</span></div>
                        <div className="flex justify-between"><span>Remaining Budget</span><span>{formatCurrency(report?.reportData?.remainingBudget)}</span></div>
                        <div className="flex justify-between"><span>Health Score</span><span>{report?.reportData?.healthScore || 0}/100</span></div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">Monthly Trend</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        {(report?.reportData?.monthlyTrend || []).map((month) => (
                            <div key={month.month} className="flex justify-between rounded-lg bg-slate-950 px-3 py-2">
                                <span>{month.month}</span>
                                <span>{formatCurrency(month.total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">AI Insights</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-white">{section.title}</h3>
                            <p className="mt-1 text-slate-400">{section.value || "No insight available yet."}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonthlyAIReport;