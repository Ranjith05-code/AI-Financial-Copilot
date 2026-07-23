import { motion } from "framer-motion";
import {
    FaWallet,
    FaPiggyBank,
    FaMoneyBillWave,
    FaChartPie,
    FaArrowUp,
    FaCoins,
} from "react-icons/fa";

const DashboardCards = ({ dashboard }) => {
    if (!dashboard) return null;

    const cards = [
        {
            title: "Total Income",
            value: `₹${(dashboard.totalIncome || 0).toLocaleString()}`,
            icon: <FaArrowUp size={28} />,
            color: "from-green-500 to-green-700",
        },
        {
            title: "Total Expenses",
            value: `₹${(dashboard.totalExpenses || 0).toLocaleString()}`,
            icon: <FaWallet size={28} />,
            color: "from-red-500 to-red-700",
        },
        {
            title: "Net Savings",
            value: `₹${(dashboard.netSavings || 0).toLocaleString()}`,
            icon: <FaCoins size={28} />,
            color: (dashboard.netSavings || 0) >= 0 ? "from-blue-500 to-blue-700" : "from-orange-500 to-orange-700",
        },
        {
            title: "Budget",
            value: `₹${(dashboard.budget || 0).toLocaleString()}`,
            icon: <FaPiggyBank size={28} />,
            color: "from-purple-500 to-purple-700",
        },
        {
            title: "Remaining",
            value: `₹${(dashboard.remainingBudget || 0).toLocaleString()}`,
            icon: <FaMoneyBillWave size={28} />,
            color: (dashboard.remainingBudget || 0) >= 0 ? "from-teal-500 to-teal-700" : "from-rose-500 to-rose-700",
        },
        {
            title: "Top Category",
            value: dashboard.topCategory || "N/A",
            icon: <FaChartPie size={28} />,
            color: "from-indigo-500 to-indigo-700",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ scale: 1.03 }}
                    className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 shadow-xl`}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white/80 text-sm">{card.title}</p>
                            <h2 className="text-3xl font-bold text-white mt-2">{card.value}</h2>
                        </div>
                        <div className="text-white">{card.icon}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardCards;
