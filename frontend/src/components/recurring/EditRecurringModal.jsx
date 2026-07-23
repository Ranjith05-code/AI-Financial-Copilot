import { useEffect, useState } from "react";

const EditRecurringModal = ({
    isOpen,
    onClose,
    recurring,
    onSave,
}) => {

    const [formData, setFormData] = useState({});

    useEffect(() => {

        if (recurring) {

            setFormData({
                ...recurring,
                nextDueDate: recurring.nextDueDate?.substring(0,10),
            });

        }

    }, [recurring]);

    if (!isOpen || !recurring) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        await onSave(recurring._id, {
            ...formData,
            amount: Number(formData.amount),
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

                    Edit Recurring Expense

                </h2>

                <input
                    value={formData.title || ""}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            title:e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                />

                <input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            amount:e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                />

                <select
                    value={formData.category || ""}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            category:e.target.value,
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
                    value={formData.frequency || ""}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            frequency:e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                >

                    <option>Monthly</option>
                    <option>Weekly</option>

                </select>

                <input
                    type="date"
                    value={formData.nextDueDate || ""}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            nextDueDate:e.target.value,
                        })
                    }
                    className="w-full p-3 rounded bg-slate-800"
                />

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-600 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 px-4 py-2 rounded"
                    >
                        Update
                    </button>

                </div>

            </form>

        </div>

    );

};

export default EditRecurringModal;