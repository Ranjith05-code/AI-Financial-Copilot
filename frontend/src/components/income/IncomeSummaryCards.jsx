import { FaArrowUp, FaArrowDown, FaPiggyBank } from "react-icons/fa";

const IncomeSummaryCards = ({ total, totalExpenses, netSavings }) => {
    const cards = [
        {
            title: "Total Income",
            value: `₹${total.toLocaleString()}`,
            icon: <FaArrowUp size={24} />,
            color: "from-green-500 to-green-700",
        },
        {
            title: "Total Expenses",
            value: `₹${totalExpenses.toLocaleString()}`,
            icon: <FaArrowDown size={24} />,
            color: "from-red-500 to-red-700",
        },
        {
            title: "Net Savings",
            value: `₹${netSavings.toLocaleString()}`,
            icon: <FaPiggyBank size={24} />,
            color: netSavings >= 0 ? "from-blue-500 to-blue-700" : "from-orange-500 to-orange-700",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, i) => (
                <div key={i} className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 shadow-xl`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white/80 text-sm">{card.title}</p>
                            <h2 className="text-3xl font-bold text-white mt-2">{card.value}</h2>
                        </div>
                        <div className="text-white">{card.icon}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IncomeSummaryCards;
