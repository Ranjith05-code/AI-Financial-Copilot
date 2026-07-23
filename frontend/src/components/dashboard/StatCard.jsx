const StatCard = ({ title, value }) => {
    return (
        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm">{title}</p>

            <h2 className="text-3xl font-bold mt-2">
                {value}
            </h2>
        </div>
    );
};

export default StatCard;