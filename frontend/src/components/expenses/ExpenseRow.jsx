import { FaEdit, FaTrash } from "react-icons/fa";

const ExpenseRow = ({
    expense,
    onEdit,
    onDelete,
}) => {

    return (

        <tr className="border-b border-slate-700 hover:bg-slate-800">

            <td className="p-4">{expense.title}</td>

            <td className="p-4 font-semibold text-green-400">
                ₹{expense.amount}
            </td>

            <td className="p-4">{expense.category}</td>

            <td className="p-4">
                {new Date(expense.date).toLocaleDateString("en-IN")}
            </td>

            <td className="p-4">

                <div className="flex gap-4">

                    <button
                        onClick={() => onEdit(expense)}
                        className="text-blue-400 hover:text-blue-300"
                    >
                        <FaEdit />
                    </button>

                    <button
                        onClick={() => onDelete(expense)}
                        className="text-red-500 hover:text-red-400"
                    >
                        <FaTrash />
                    </button>

                </div>

            </td>

        </tr>

    );

};

export default ExpenseRow;