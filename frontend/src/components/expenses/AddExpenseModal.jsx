import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AddExpenseModal = ({
    isOpen,
    onClose,
    onSave,
}) => {

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({
            ...formData,
            amount: Number(formData.amount),
        });

        setFormData({
            title: "",
            amount: "",
            category: "Food",
            date: new Date().toISOString().split("T")[0],
            notes: "",
        });

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
                    height: "600px",
                    borderRadius: "20px",
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.6)",
                },
            }}
        >

            <h2 className="text-3xl font-bold mb-8">

                Add Expense

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

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
                    type="number"
                    name="amount"
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
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Entertainment</option>
                    <option>Health</option>
                    <option>Education</option>

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

                <div className="flex justify-end gap-4 pt-5">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-gray-600"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-blue-600"
                    >

                        Save Expense

                    </button>

                </div>

            </form>

        </Modal>

    );

};

export default AddExpenseModal;