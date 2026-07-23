const DeleteIncomeModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
                <h2 className="text-2xl font-bold mb-3">Delete Income</h2>
                <p className="text-slate-400 mb-8">Are you sure you want to delete this income entry? This cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onDelete} className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition">
                        Delete
                    </button>
                    <button onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 py-3 rounded-xl font-semibold transition">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteIncomeModal;
