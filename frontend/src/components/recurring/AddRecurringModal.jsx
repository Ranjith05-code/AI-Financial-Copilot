import { useState } from "react";

const AddRecurringModal = ({
    isOpen,
    onClose,
    onSave,
}) => {

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Bills",
        frequency: "Monthly",
        nextDueDate: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        await onSave({
            ...formData,
            amount: Number(formData.amount),
        });

        setFormData({
            title: "",
            amount: "",
            category: "Bills",
            frequency: "Monthly",
            nextDueDate: "",
        });

        onClose();

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 p-6 rounded-xl w-[450px] space-y-4"
            >

                <h2 className="text-2xl font-bold">
                    Add Recurring Expense
                </h2>

                <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            title: e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                    required
                />

                <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            amount: e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                    required
                />

                <select
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            category: e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                >

                    <option>Bills</option>
                    <option>Food</option>
                    <option>Entertainment</option>
                    <option>Shopping</option>
                    <option>Transport</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Other</option>

                </select>

                <select
                    value={formData.frequency}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            frequency: e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                >

                    <option>Monthly</option>
                    <option>Weekly</option>

                </select>

                <input
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            nextDueDate: e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                    required
                />

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600"
                    >
                        Save
                    </button>

                </div>

            </form>

        </div>

    );

};

export default AddRecurringModal;