import {
    FaPlus,
    FaFileCsv,
    FaFilePdf,
    FaFileExcel,
    FaSyncAlt,
} from "react-icons/fa";

const ExpenseHeader = ({
    onAddExpense,
    onExportCSV,
    onExportPDF,
    onExportExcel,
    onGenerateRecurring,
}) => {

    return (

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">

            <div>

                <h1 className="text-4xl font-bold">

                    Expense Management

                </h1>

                <p className="text-slate-400 mt-2">

                    Manage all your expenses in one place.

                </p>

            </div>

            <div className="flex flex-wrap gap-3">

                <button
                    onClick={onGenerateRecurring}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold transition"
                >

                    <FaSyncAlt />

                    Generate Recurring

                </button>

                <button
                    onClick={onExportCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold transition"
                >

                    <FaFileCsv />

                    Export CSV

                </button>

                <button
                    onClick={onExportPDF}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
                >

                    <FaFilePdf />

                    Export PDF

                </button>

                <button
                    onClick={onExportExcel}
                    className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 px-5 py-3 rounded-xl font-semibold transition"
                >

                    <FaFileExcel />

                    Export Excel

                </button>

                <button
                    onClick={onAddExpense}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
                >

                    <FaPlus />

                    Add Expense

                </button>

            </div>

        </div>

    );

};

export default ExpenseHeader;