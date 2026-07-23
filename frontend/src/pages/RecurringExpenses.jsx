import { useState } from "react";

import RecurringTable from "../components/recurring/RecurringTable";

import AddRecurringModal from "../components/recurring/AddRecurringModal";
import EditRecurringModal from "../components/recurring/EditRecurringModal";
import DeleteRecurringModal from "../components/recurring/DeleteRecurringModal";

import LoadingSpinner from "../components/common/LoadingSpinner";

import useRecurringExpenses from "../hooks/useRecurringExpenses";

const RecurringExpenses = () => {

    const {

        recurringExpenses,

        loading,

        createRecurring,

        updateRecurring,

        removeRecurring,

        generateExpenses,

    } = useRecurringExpenses();

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const [selected, setSelected] = useState(null);

    return (

        <>

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">

                    Recurring Expenses

                </h1>

                <div className="flex gap-4">

                    <button
                        onClick={generateExpenses}
                        className="bg-green-600 px-5 py-3 rounded-xl font-semibold"
                    >
                        Generate This Month
                    </button>

                    <button
                        onClick={() => setShowAdd(true)}
                        className="bg-blue-600 px-5 py-3 rounded-xl font-semibold"
                    >
                        Add Recurring
                    </button>

                </div>

            </div>

            {

                loading

                    ? <LoadingSpinner />

                    : (

                        <RecurringTable

                            recurringExpenses={recurringExpenses}

                            onEdit={(expense) => {

                                setSelected(expense);

                                setShowEdit(true);

                            }}

                            onDelete={(expense) => {

                                setSelected(expense);

                                setShowDelete(true);

                            }}

                        />

                    )

            }

            <AddRecurringModal

                isOpen={showAdd}

                onClose={() => setShowAdd(false)}

                onSave={createRecurring}

            />

            <EditRecurringModal

                isOpen={showEdit}

                onClose={() => setShowEdit(false)}

                recurring={selected}

                onSave={updateRecurring}

            />

            <DeleteRecurringModal

                isOpen={showDelete}

                onClose={() => setShowDelete(false)}

                onDelete={async () => {

                    if (!selected) return;

                    await removeRecurring(selected._id);

                    setShowDelete(false);

                }}

            />

        </>

    );

};

export default RecurringExpenses;