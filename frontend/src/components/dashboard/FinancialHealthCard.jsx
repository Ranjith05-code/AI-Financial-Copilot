import { FaHeartbeat } from "react-icons/fa";

const FinancialHealthCard = ({ score, status }) => {

    const getColor = () => {

        if (score >= 90) return "text-green-400";
        if (score >= 75) return "text-blue-400";
        if (score >= 60) return "text-yellow-400";

        return "text-red-400";

    };

    return (

        <div className="bg-slate-800 rounded-2xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-4">

                <FaHeartbeat
                    size={30}
                    className={getColor()}
                />

                <h2 className="text-2xl font-bold">

                    Financial Health

                </h2>

            </div>

            <h1
                className={`text-6xl font-bold ${getColor()}`}
            >

                {score}

            </h1>

            <p className="text-slate-400 mt-3">

                Score out of 100

            </p>

            <div
                className={`mt-6 text-xl font-semibold ${getColor()}`}
            >

                {status}

            </div>

        </div>

    );

};

export default FinancialHealthCard;