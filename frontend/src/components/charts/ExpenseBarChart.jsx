import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const ExpenseBarChart = ({ data }) => {

    if (!data) return null;

    return (

        <div className="bg-slate-800 rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5">

                Monthly Expenses

            </h2>

            <ResponsiveContainer width="100%" height={320}>

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="amount"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default ExpenseBarChart;