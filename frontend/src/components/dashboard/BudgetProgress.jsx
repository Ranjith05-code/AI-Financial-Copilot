const BudgetProgress = ({ budget, remaining }) => {

    if (!budget) return null;

    const spent = budget - remaining;

    const percent = Math.min(
        (spent / budget) * 100,
        100
    );

    return (

        <div className="bg-slate-800 rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold">

                Budget Usage

            </h2>

            <div className="w-full bg-slate-700 h-4 rounded-full mt-6">

                <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                        width: `${percent}%`,
                    }}
                />

            </div>

            <p className="mt-4">

                ₹{spent} / ₹{budget}

            </p>

        </div>

    );

};

export default BudgetProgress;