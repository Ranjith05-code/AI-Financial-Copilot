import { FaEdit, FaTrash } from "react-icons/fa";

const RecurringTable = ({
    recurringExpenses,
    onEdit,
    onDelete,
}) => {

    return (

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">

            <table className="w-full">

                <thead className="bg-slate-800">

                    <tr>

                        <th className="p-4 text-left">Title</th>

                        <th className="p-4 text-left">Amount</th>

                        <th className="p-4 text-left">Category</th>

                        <th className="p-4 text-left">Frequency</th>

                        <th className="p-4 text-left">Next Due</th>

                        <th className="p-4 text-center">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        recurringExpenses.map((expense) => (

                            <tr
                                key={expense._id}
                                className="border-t border-slate-800"
                            >

                                <td className="p-4">{expense.title}</td>

                                <td className="p-4">₹{expense.amount}</td>

                                <td className="p-4">{expense.category}</td>

                                <td className="p-4">{expense.frequency}</td>

                                <td className="p-4">

                                    {new Date(
                                        expense.nextDueDate
                                    ).toLocaleDateString()}

                                </td>

                                <td className="p-4 flex justify-center gap-3">

                                    <button
                                        onClick={() => onEdit(expense)}
                                        className="text-blue-400"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => onDelete(expense)}
                                        className="text-red-400"
                                    >
                                        <FaTrash />
                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

};

export default RecurringTable;