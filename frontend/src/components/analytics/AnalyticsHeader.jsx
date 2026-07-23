import { FaChartLine } from "react-icons/fa";

const AnalyticsHeader = () => {

    return (

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-4xl font-bold flex items-center gap-3">

                    <FaChartLine className="text-blue-500" />

                    Financial Analytics

                </h1>

                <p className="text-slate-400 mt-2">

                    Analyze your spending patterns, budget performance, and financial insights.

                </p>

            </div>

        </div>

    );

};

export default AnalyticsHeader;