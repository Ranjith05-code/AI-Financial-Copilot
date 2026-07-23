import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
} from "react-icons/fa";

const BudgetAlert = ({ budget, remaining }) => {

    if (!budget) return null;

    const spent = budget - remaining;

    const percent = (spent / budget) * 100;

    let icon;
    let title;
    let message;
    let color;

    if (remaining < 0) {

        icon = <FaTimesCircle size={30} />;

        title = "Budget Exceeded";

        message = `You exceeded your budget by ₹${Math.abs(remaining)}.`;

        color = "border-red-500 text-red-400";

    }

    else if (percent >= 90) {

        icon = <FaExclamationTriangle size={30} />;

        title = "Budget Warning";

        message = "You have used more than 90% of your budget.";

        color = "border-yellow-500 text-yellow-400";

    }

    else {

        icon = <FaCheckCircle size={30} />;

        title = "Budget Healthy";

        message = `You still have ₹${remaining} remaining.`;

        color = "border-green-500 text-green-400";

    }

    return (

        <div className={`bg-slate-800 rounded-2xl p-6 border-l-4 ${color}`}>

            <div className="flex items-center gap-4">

                {icon}

                <div>

                    <h2 className="text-2xl font-bold">

                        {title}

                    </h2>

                    <p className="mt-2 text-slate-300">

                        {message}

                    </p>

                </div>

            </div>

        </div>

    );

};

export default BudgetAlert;