import { useState, useEffect } from "react";

import ExpenseRow from "./ExpenseRow";
import EmptyExpense from "./EmptyExpense";

import Pagination from "../common/Pagination";

const ExpenseTable = ({
    expenses,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    rowsPerPage,
    totalRecords,
    onPageChange,
    onRowsPerPageChange,
}) => {

    const [page, setPage] = useState(currentPage || 1);

    useEffect(() => {

        setPage(currentPage);

    }, [currentPage]);

    const handlePageChange = (newPage) => {

        setPage(newPage);

        onPageChange(newPage);

    };

    if (!expenses || expenses.length === 0) {

        return <EmptyExpense />;

    }

    return (

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-800">

                        <tr>

                            <th className="p-4 text-left">

                                Title

                            </th>

                            <th className="p-4 text-left">

                                Amount

                            </th>

                            <th className="p-4 text-left">

                                Category

                            </th>

                            <th className="p-4 text-left">

                                Date

                            </th>

                            <th className="p-4 text-left">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            expenses.map((expense) => (

                                <ExpenseRow

                                    key={expense._id}

                                    expense={expense}

                                    onEdit={onEdit}

                                    onDelete={onDelete}

                                />

                            ))

                        }

                    </tbody>

                </table>

            </div>

            <div className="border-t border-slate-700 px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">

                <div className="flex items-center gap-3">

                    <span className="text-slate-400">

                        Rows per page

                    </span>

                    <select

                        value={rowsPerPage}

                        onChange={(e) =>
                            onRowsPerPageChange(e.target.value)
                        }

                        className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"

                    >

                        <option value={5}>5</option>

                        <option value={10}>10</option>

                        <option value={20}>20</option>

                        <option value={50}>50</option>

                    </select>

                </div>

                <Pagination

                    currentPage={page}

                    totalPages={totalPages}

                    totalRecords={totalRecords}

                    onPageChange={handlePageChange}

                />

            </div>

        </div>

    );

};

export default ExpenseTable;