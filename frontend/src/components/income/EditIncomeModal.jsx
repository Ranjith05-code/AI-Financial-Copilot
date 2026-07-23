import { useEffect, useState } from "react";

const SOURCES = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];

const EditIncomeModal = ({ isOpen, onClose, onSave, income }) => {
    const [form, setForm] = useState({ title: "", amount: "", source: "Salary", date: "" });

    useEffect(() => {
        if (income) {
            setForm({
                title: income.title || "",
                amount: income.amount || "",
                source: income.source || "Salary",
                date: income.date ? income.date.slice(0, 10) : "",
            });
        }
    }, [income]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(income._id, { ...form, amount: Number(form.amount) });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Edit Income</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Amount (₹)"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                        min="1"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                    <select
                        value={form.source}
                        onChange={(e) => setForm({ ...form, source: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3"
                    >
                        {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3"
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">
                            Save Changes
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 py-3 rounded-xl font-semibold transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditIncomeModal;
