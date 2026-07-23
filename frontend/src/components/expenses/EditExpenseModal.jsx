import { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const EditExpenseModal = ({ isOpen, onClose, expense, onSave }) => {

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        date: "",
        notes: "",
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                title: expense.title || "",
                amount: expense.amount || "",
                category: expense.category || "Food",
                date: expense.date ? expense.date.split("T")[0] : "",
                notes: expense.notes || "",
            });
        }
    }, [expense]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(expense._id, { ...formData, amount: Number(formData.amount) });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                content: {
                    width: "500px",
                    margin: "auto",
                    borderRadius: "20px",
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                    height: "fit-content",
                    top: "50%",
                    transform: "translateY(-50%)",
                },
                overlay: { backgroundColor: "rgba(0,0,0,0.6)" },
            }}
        >
            <h2 className="text-3xl font-bold mb-6">Edit Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    placeholder="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
                <select
                    className="w-full p-3 rounded-lg bg-slate-800"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Entertainment</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Other</option>
                </select>
                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                <textarea
                    className="w-full p-3 rounded-lg bg-slate-800 resize-none"
                    placeholder="Notes (optional)"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                />
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg transition">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition">
                        Update
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditExpenseModal;
