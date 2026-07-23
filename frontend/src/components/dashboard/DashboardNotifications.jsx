import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaInfoCircle,
} from "react-icons/fa";

const iconMap = {
    success: <FaCheckCircle className="text-green-400 text-2xl" />,
    warning: <FaExclamationTriangle className="text-yellow-400 text-2xl" />,
    error: <FaTimesCircle className="text-red-400 text-2xl" />,
    info: <FaInfoCircle className="text-blue-400 text-2xl" />,
};

const DashboardNotifications = ({ notifications }) => {

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

                    <div>

                        <h3 className="font-bold text-lg">

                            {notification.title}

                        </h3>

                        <p className="text-slate-300 mt-1">

                            {notification.message}

                        </p>

                    </div>

                </div>

            ))}

        </div>

    );

};

export default DashboardNotifications;