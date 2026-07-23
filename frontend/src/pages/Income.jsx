import { useState } from "react";
import useIncome from "../hooks/useIncome";
import useExpenses from "../hooks/useExpenses";
import IncomeSummaryCards from "../components/income/IncomeSummaryCards";
import IncomeTable from "../components/income/IncomeTable";
import AddIncomeModal from "../components/income/AddIncomeModal";
import EditIncomeModal from "../components/income/EditIncomeModal";
import DeleteIncomeModal from "../components/income/DeleteIncomeModal";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Income = () => {
    const { incomes, total, loading, createIncome, editIncome, removeIncome } = useIncome();
    const { expenses } = useExpenses();

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netSavings = total - totalExpenses;

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Income</h1>
                    <p className="text-slate-400 mt-1">Track all your income sources</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                    + Add Income
                </button>
            </div>

            <IncomeSummaryCards total={total} totalExpenses={totalExpenses} netSavings={netSavings} />

            {loading ? (
                <LoadingSpinner />
            ) : (
                <IncomeTable
                    incomes={incomes}
                    onEdit={(income) => { setSelected(income); setShowEdit(true); }}
                    onDelete={(income) => { setSelected(income); setShowDelete(true); }}
                />
            )}

            <AddIncomeModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSave={createIncome} />
            <EditIncomeModal isOpen={showEdit} onClose={() => setShowEdit(false)} income={selected} onSave={editIncome} />
            <DeleteIncomeModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onDelete={async () => {
                    if (!selected) return;
                    await removeIncome(selected._id);
                    setShowDelete(false);
                }}
            />
        </>
    );
};

export default Income;
