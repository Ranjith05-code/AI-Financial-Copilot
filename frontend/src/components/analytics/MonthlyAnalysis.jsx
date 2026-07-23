import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const MonthlyAnalysis = ({ data }) => {

    if (!data || data.length === 0) {

        return (

            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-4">

                    Monthly Expenses

                </h2>

                <p className="text-slate-400">

                    No monthly expense data available.

                </p>

            </div>

        );

    }

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Monthly Expenses

            </h2>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="amount"
                            fill="#3B82F6"
                            radius={[8,8,0,0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

};

export default MonthlyAnalysis;