import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const BudgetModal = ({
    isOpen,
    onClose,
    onSave,
}) => {

    const [amount, setAmount] = useState("");

    const currentMonth = new Date().getMonth() + 1;

    const currentYear = new Date().getFullYear();

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({
            amount: Number(amount),
            month: currentMonth,
            year: currentYear,
        });

        setAmount("");

        onClose();

    };

    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                content: {
                    width: "450px",
                    margin: "auto",
                    borderRadius: "20px",
                    background: "#0f172a",
                    color: "white",
                },
            }}
        >

            <h2 className="text-3xl font-bold mb-8">

                Set Monthly Budget

            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    type="number"
                    placeholder="Budget Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-600 px-5 py-2 rounded"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 px-5 py-2 rounded"
                    >

                        Save

                    </button>

                </div>

            </form>

        </Modal>

    );

};

export default BudgetModal;