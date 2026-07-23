import { FaEdit, FaTrash } from "react-icons/fa";

const SOURCE_COLORS = {
    Salary: "bg-green-500/20 text-green-400",
    Freelance: "bg-blue-500/20 text-blue-400",
    Business: "bg-purple-500/20 text-purple-400",
    Investment: "bg-yellow-500/20 text-yellow-400",
    Gift: "bg-pink-500/20 text-pink-400",
    Other: "bg-slate-500/20 text-slate-400",
};

const IncomeTable = ({ incomes, onEdit, onDelete }) => {
    if (!incomes.length) {
        return (
            <div className="bg-slate-800 rounded-2xl p-12 text-center text-slate-400">
                No income records yet. Add your first income entry.
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full">
                <thead className="bg-slate-700 text-slate-300 text-sm uppercase">
                    <tr>
                        <th className="px-6 py-4 text-left">Title</th>
                        <th className="px-6 py-4 text-left">Source</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {incomes.map((income) => (
                        <tr key={income._id} className="hover:bg-slate-700/50 transition">
                            <td className="px-6 py-4 font-medium">{income.title}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${SOURCE_COLORS[income.source] || SOURCE_COLORS.Other}`}>
                                    {income.source}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-green-400 font-semibold">₹{income.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-slate-400">{new Date(income.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => onEdit(income)} className="text-blue-400 hover:text-blue-300 transition">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => onDelete(income)} className="text-red-400 hover:text-red-300 transition">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeTable;
