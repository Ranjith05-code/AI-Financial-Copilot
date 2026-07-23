import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import ExpenseHeader from "../components/expenses/ExpenseHeader";
import ExpenseSummaryCards from "../components/expenses/ExpenseSummaryCards";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseTable from "../components/expenses/ExpenseTable";

import AddExpenseModal from "../components/expenses/AddExpenseModal";
import EditExpenseModal from "../components/expenses/EditExpenseModal";
import DeleteExpenseModal from "../components/expenses/DeleteExpenseModal";

import LoadingSpinner from "../components/common/LoadingSpinner";

import useExpenses from "../hooks/useExpenses";

import {
    exportExpensesToCSV,
    exportExpensesToPDF,
    exportExpensesToExcel,
} from "../utils/exportExpenses";

const Expenses = () => {

    const {

        expenses,

        loading,

        createExpense,

        editExpense,

        removeExpense,

        generateRecurring,

    } = useExpenses();

    const [filteredExpenses, setFilteredExpenses] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedExpense, setSelectedExpense] = useState(null);

    const handleFilterChange = useCallback((filtered) => {
        setFilteredExpenses(filtered);
        setCurrentPage(1);
    }, []);

    const displayExpenses = useMemo(() => {

        return filteredExpenses.length
            ? filteredExpenses
            : expenses;

    }, [filteredExpenses, expenses]);

    const totalPages = Math.ceil(
        displayExpenses.length / rowsPerPage
    );

    const paginatedExpenses = useMemo(() => {

        const start = (currentPage - 1) * rowsPerPage;

        return displayExpenses.slice(
            start,
            start + rowsPerPage
        );

    }, [
        displayExpenses,
        currentPage,
        rowsPerPage,
    ]);

    const handleGenerateRecurring = async () => {

        try {

            await generateRecurring();

        }

        catch (error) {

            console.error(error);

        }

    };

    const handleExportCSV = () => {

        if (!displayExpenses.length) {

            toast.warning(
                "No expenses available."
            );

            return;

        }

        exportExpensesToCSV(displayExpenses);

        toast.success(
            "CSV exported successfully."
        );

    };
        const handleExportPDF = () => {

        if (!displayExpenses.length) {

            toast.warning(
                "No expenses available."
            );

            return;

        }

        exportExpensesToPDF(displayExpenses);

        toast.success(
            "PDF exported successfully."
        );

    };

    const handleExportExcel = () => {

        if (!displayExpenses.length) {

            toast.warning(
                "No expenses available."
            );

            return;

        }

        exportExpensesToExcel(displayExpenses);

        toast.success(
            "Excel exported successfully."
        );

    };

    return (

        <>

            <ExpenseHeader

                onAddExpense={() =>
                    setShowAddModal(true)
                }

                onExportCSV={handleExportCSV}

                onExportPDF={handleExportPDF}

                onExportExcel={handleExportExcel}

                onGenerateRecurring={
                    handleGenerateRecurring
                }

            />

            <ExpenseSummaryCards
                expenses={displayExpenses}
            />

            <ExpenseFilters

                expenses={expenses}

                setFilteredExpenses={handleFilterChange}

            />

            <div className="mt-6">

                {

                    loading

                        ? (

                            <LoadingSpinner />

                        )

                        : (

                            <ExpenseTable

                                expenses={paginatedExpenses}

                                currentPage={currentPage}

                                totalPages={totalPages}

                                rowsPerPage={rowsPerPage}

                                totalRecords={
                                    displayExpenses.length
                                }

                                onPageChange={
                                    setCurrentPage
                                }

                                onRowsPerPageChange={(value) => {

                                    setRowsPerPage(
                                        Number(value)
                                    );

                                    setCurrentPage(1);

                                }}

                                onEdit={(expense) => {

                                    setSelectedExpense(
                                        expense
                                    );

                                    setShowEditModal(
                                        true
                                    );

                                }}

                                onDelete={(expense) => {

                                    setSelectedExpense(
                                        expense
                                    );

                                    setShowDeleteModal(
                                        true
                                    );

                                }}

                            />

                        )

                }

            </div>
                        <AddExpenseModal

                isOpen={showAddModal}

                onClose={() =>
                    setShowAddModal(false)
                }

                onSave={createExpense}

            />

            <EditExpenseModal

                isOpen={showEditModal}

                onClose={() =>
                    setShowEditModal(false)
                }

                expense={selectedExpense}

                onSave={editExpense}

            />

            <DeleteExpenseModal

                isOpen={showDeleteModal}

                onClose={() =>
                    setShowDeleteModal(false)
                }

                onDelete={async () => {

                    if (!selectedExpense)
                        return;

                    await removeExpense(
                        selectedExpense._id
                    );

                    setShowDeleteModal(false);

                }}

            />

        </>

    );

};

export default Expenses;