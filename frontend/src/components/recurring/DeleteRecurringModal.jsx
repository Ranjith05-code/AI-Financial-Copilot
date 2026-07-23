const DeleteRecurringModal = ({
    isOpen,
    onClose,
    onDelete,
}) => {

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-slate-900 p-6 rounded-xl w-[400px]">

                <h2 className="text-2xl font-bold mb-6">

                    Delete Recurring Expense

                </h2>

                <p className="mb-6">

                    Are you sure you want to delete this recurring expense?

                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="bg-gray-600 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="bg-red-600 px-4 py-2 rounded"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteRecurringModal;