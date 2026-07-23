import { FaWallet, FaMoneyBillWave, FaChartPie, FaPiggyBank, FaArrowUp, FaCoins } from "react-icons/fa";

const AnalyticsCards = ({ totalExpenses, totalIncome, budget, remainingBudget, topCategory, netSavings }) => {
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

    const cards = [
        { title: "Total Income",    value: `₹${(totalIncome || 0).toLocaleString()}`,    icon: <FaArrowUp size={24} />,       color: "from-green-500 to-green-700"  },
        { title: "Total Expenses",  value: `₹${(totalExpenses || 0).toLocaleString()}`,  icon: <FaWallet size={24} />,        color: "from-red-500 to-red-700"      },
        { title: "Net Savings",     value: `₹${(netSavings || 0).toLocaleString()}`,     icon: <FaCoins size={24} />,         color: netSavings >= 0 ? "from-blue-500 to-blue-700" : "from-orange-500 to-orange-700" },
        { title: "Savings Rate",    value: `${savingsRate}%`,                             icon: <FaPiggyBank size={24} />,     color: "from-purple-500 to-purple-700"},
        { title: "Budget",          value: `₹${(budget || 0).toLocaleString()}`,          icon: <FaMoneyBillWave size={24} />, color: "from-teal-500 to-teal-700"    },
        { title: "Top Category",    value: topCategory || "N/A",                          icon: <FaChartPie size={24} />,      color: "from-indigo-500 to-indigo-700"},
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

export default AnalyticsCards;
