import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const IncomeVsExpenseChart = ({ totalIncome, totalExpenses, budget }) => {
    const data = [
        { name: "This Month", Income: totalIncome, Expenses: totalExpenses, Budget: budget },
    ];

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Income vs Expenses vs Budget</h2>
            <p className="text-slate-400 text-sm mb-6">Overall financial position at a glance</p>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap="40%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v.toLocaleString()}`} />
                        <Tooltip
                            contentStyle={{ background: "#1e293b", border: "none", borderRadius: "12px" }}
                            formatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <Legend />
                        <Bar dataKey="Income"   fill="#10b981" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Budget"   fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeVsExpenseChart;
