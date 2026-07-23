import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
];

const CategoryAnalysis = ({ data }) => {

    if (!data || data.length === 0) {

        return (

            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-4">

                    Category Analysis

                </h2>

                <p className="text-slate-400">

                    No category data available.

                </p>

            </div>

        );

    }

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Category Analysis

            </h2>

            <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={110}
                            label
                        >

                            {

                                data.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

};

export default CategoryAnalysis;