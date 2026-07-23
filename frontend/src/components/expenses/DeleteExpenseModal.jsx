import Modal from "react-modal";

Modal.setAppElement("#root");

const DeleteExpenseModal = ({
    isOpen,
    onClose,
    onDelete,
}) => {

    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                content: {
                    width: "400px",
                    margin: "auto",
                    borderRadius: "20px",
                    background: "#0f172a",
                    color: "white",
                },
            }}
        >

            <h2 className="text-2xl font-bold">

                Delete Expense

            </h2>

            <p className="mt-4">

                Are you sure you want to delete this expense?

            </p>

            <div className="flex justify-end gap-4 mt-8">

                <button
                    onClick={onClose}
                    className="bg-gray-600 px-5 py-2 rounded"
                >
                    Cancel
                </button>

                <button
                    onClick={onDelete}
                    className="bg-red-600 px-5 py-2 rounded"
                >
                    Delete
                </button>

            </div>

        </Modal>

    );

};

export default DeleteExpenseModal;