import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { getYearlyAIReport } from "../services/aiService";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const YearlyAIReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReport = async () => {
            try {
                const res = await getYearlyAIReport();
                setReport(res);
            } catch (error) {
                console.error(error);
                toast.error("Unable to load yearly AI report.");
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
        { title: "Monthly Trend Summary", value: report?.report?.monthlyTrendSummary },
        { title: "Good Habits", value: report?.report?.goodHabits?.join(" • ") },
        { title: "Bad Habits", value: report?.report?.badHabits?.join(" • ") },
        { title: "Budget Analysis", value: report?.report?.budgetAnalysis },
        { title: "Savings Opportunities", value: report?.report?.savingsOpportunities?.join(" • ") },
        { title: "Risk Factors", value: report?.report?.riskFactors?.join(" • ") },
        { title: "Recommendations", value: report?.report?.recommendations?.join(" • ") },
    ], [report]);

    const handleDownloadReport = () => {
        if (!report?.report) {
            toast.error("No yearly report available to download yet.");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Yearly AI Report", 14, 16);
        doc.setFontSize(10);
        doc.text("Generated from your annual financial insights", 14, 23);

        autoTable(doc, {
            startY: 30,
            head: [["Metric", "Value"]],
            body: [
                ["Total Spending", formatCurrency(report?.reportData?.totalExpenses)],
                ["Budget", formatCurrency(report?.reportData?.totalBudget)],
                ["Remaining Budget", formatCurrency(report?.reportData?.remainingBudget)],
                ["Top Category", report?.reportData?.topCategory || "N/A"],
                ["Lowest Category", report?.reportData?.lowestCategory || "N/A"],
                ["Health Score", `${report?.reportData?.healthScore || 0}/100`],
            ],
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [15, 23, 42] },
        });

        let currentY = doc.lastAutoTable.finalY + 10;
        const insightBlocks = [
            { title: "Executive Summary", value: report.report.executiveSummary },
            { title: "Financial Health", value: report.report.financialHealth },
            { title: "Top Spending Categories", value: report.report.topSpendingCategories?.join(", ") },
            { title: "Monthly Trend Summary", value: report.report.monthlyTrendSummary },
            { title: "Good Habits", value: report.report.goodHabits?.join(" • ") },
            { title: "Bad Habits", value: report.report.badHabits?.join(" • ") },
            { title: "Budget Analysis", value: report.report.budgetAnalysis },
            { title: "Savings Opportunities", value: report.report.savingsOpportunities?.join(" • ") },
            { title: "Risk Factors", value: report.report.riskFactors?.join(" • ") },
            { title: "Recommendations", value: report.report.recommendations?.join(" • ") },
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

        doc.save("yearly-ai-report.pdf");
        toast.success("Yearly AI report downloaded as PDF.");
    };

    if (loading) {
        return <div className="text-slate-400">Generating your yearly AI report...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Yearly AI Report</h1>
                        <p className="mt-2 text-slate-400">A yearly snapshot of your spending, budget health, and savings opportunities.</p>
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
                    <h2 className="text-xl font-semibold">Yearly Summary</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="flex justify-between"><span>Total Spending</span><span>{formatCurrency(report?.reportData?.totalExpenses)}</span></div>
                        <div className="flex justify-between"><span>Budget</span><span>{formatCurrency(report?.reportData?.totalBudget)}</span></div>
                        <div className="flex justify-between"><span>Remaining Budget</span><span>{formatCurrency(report?.reportData?.remainingBudget)}</span></div>
                        <div className="flex justify-between"><span>Top Category</span><span>{report?.reportData?.topCategory || "N/A"}</span></div>
                        <div className="flex justify-between"><span>Lowest Category</span><span>{report?.reportData?.lowestCategory || "N/A"}</span></div>
                        <div className="flex justify-between"><span>Health Score</span><span>{report?.reportData?.healthScore || 0}/100</span></div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold">Month-wise Trend</h2>
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

export default YearlyAIReport;
