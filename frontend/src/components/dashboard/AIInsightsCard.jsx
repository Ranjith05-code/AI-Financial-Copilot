import { FaRobot } from "react-icons/fa";

const AIInsightsCard = ({ dashboard }) => {

    if (!dashboard) return null;

    const averageExpense =
        dashboard.totalTransactions > 0
            ? (
                dashboard.totalExpenses /
                dashboard.totalTransactions
            ).toFixed(2)
            : 0;

    const budgetUsed =
        dashboard.budget > 0
            ? (
                (dashboard.totalExpenses /
                    dashboard.budget) *
                100
            ).toFixed(0)
            : 0;

    const insights = [

        `Your highest spending category is ${dashboard.topCategory}.`,

        `You have used ${budgetUsed}% of your monthly budget.`,

        `Average expense per transaction is ₹${averageExpense}.`,

        `Remaining budget is ₹${dashboard.remainingBudget}.`,

        `Consider reducing ${dashboard.topCategory} expenses by 10% to improve savings.`,

    ];

    return (

        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <div className="flex items-center gap-3 mb-5">

                <FaRobot
                    size={28}
                    className="text-blue-400"
                />

                <h2 className="text-2xl font-bold">

                    AI Insights

                </h2>

            </div>

            <ul className="space-y-4">

                {

                    insights.map((item, index) => (

                        <li
                            key={index}
                            className="flex gap-3"
                        >

                            <span className="text-green-400">

                                ✓

                            </span>

                            <span>

                                {item}

                            </span>

                        </li>

                    ))

                }

            </ul>

        </div>

    );

};

export default AIInsightsCard;