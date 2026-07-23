import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
];

const CategoryPieChart = ({ data }) => {

    if (!data || data.length === 0) return null;

    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <h2 className="text-xl font-semibold mb-4">

                Category Breakdown

            </h2>

            <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}
                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
};

export default CategoryPieChart;