import {
    FaWallet,
    FaMoneyBillWave,
    FaArrowUp,
    FaLayerGroup,
} from "react-icons/fa";

const ExpenseSummaryCards = ({ expenses }) => {

    const totalExpenses = expenses.length;

    const totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const highestExpense =
        expenses.length > 0
            ? Math.max(...expenses.map((e) => e.amount))
            : 0;

    const categories = new Set(
        expenses.map((e) => e.category)
    ).size;

    const cards = [
        {
            title: "Total Expenses",
            value: totalExpenses,
            icon: <FaWallet />,
            color: "bg-blue-600",
        },
        {
            title: "Total Amount",
            value: `₹${totalAmount}`,
            icon: <FaMoneyBillWave />,
            color: "bg-green-600",
        },
        {
            title: "Highest Expense",
            value: `₹${highestExpense}`,
            icon: <FaArrowUp />,
            color: "bg-red-600",
        },
        {
            title: "Categories",
            value: categories,
            icon: <FaLayerGroup />,
            color: "bg-purple-600",
        },
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {

                cards.map((card, index) => (

                    <div
                        key={index}
                        className="bg-slate-900 rounded-xl p-6 shadow-lg hover:scale-105 transition"
                    >

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-slate-400">

                                    {card.title}

                                </p>

                                <h2 className="text-3xl font-bold mt-2">

                                    {card.value}

                                </h2>

                            </div>

                            <div
                                className={`${card.color} p-4 rounded-xl text-2xl`}
                            >

                                {card.icon}

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

};

export default ExpenseSummaryCards;