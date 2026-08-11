import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaInfoCircle,
} from "react-icons/fa";

import { createBudget } from "../../services/budgetService";

const iconMap = {
    success: <FaCheckCircle className="text-green-400 text-2xl" />,
    warning: <FaExclamationTriangle className="text-yellow-400 text-2xl" />,
    error: <FaTimesCircle className="text-red-400 text-2xl" />,
    info: <FaInfoCircle className="text-blue-400 text-2xl" />,
};

const DashboardNotifications = ({ notifications }) => {
    const navigate = useNavigate();

    const handleRolloverBudget = async (notification) => {
        try {
            await createBudget({
                amount: Number(notification.suggestedBudgetAmount || 0),
                month: Number(notification.month || new Date().getMonth() + 1),
                year: Number(notification.year || new Date().getFullYear()),
            });

            toast.success("Last month’s budget has been reused for this month.");
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to apply the budget rollover.");
        }
    };

    if (!notifications || notifications.length === 0) {

        return null;

    }

    return (

        <div className="mt-8 space-y-4">

            {notifications.map((notification, index) => (

                <div
                    key={index}
                    className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex items-start gap-4"
                >

                    {iconMap[notification.type]}

                    <div className="flex-1">

                        <h3 className="font-bold text-lg">

                            {notification.title}

                        </h3>

                        <p className="text-slate-300 mt-1">

                            {notification.message}

                        </p>

                        {notification.action === "rollover-budget" && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleRolloverBudget(notification)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                                >
                                    Use previous month budget
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/budget")}
                                    className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                                >
                                    Set a new budget
                                </button>
                            </div>
                        )}

                    </div>

                </div>

            ))}

        </div>

    );

};

export default DashboardNotifications;