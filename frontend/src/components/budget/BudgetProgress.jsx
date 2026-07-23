const BudgetProgress = ({ budget, totalExpenses }) => {

    const budgetAmount =
        typeof budget === "number"
            ? budget
            : budget?.amount || 0;

    if (budgetAmount === 0) return null;

    const used = Math.min(
        (totalExpenses / budgetAmount) * 100,
        100
    );

    const remaining = budgetAmount - totalExpenses;

    return (

        <div className="bg-slate-900 rounded-2xl p-8 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Budget Usage

            </h2>

            <div className="w-full bg-slate-700 rounded-full h-5">

                <div
                    className={`h-5 rounded-full transition-all duration-500 ${
                        used >= 90
                            ? "bg-red-500"
                            : used >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                    style={{
                        width: `${used}%`,
                    }}
                />

            </div>

            <div className="mt-6 grid grid-cols-3 gap-6">

                <div>

                    <p className="text-slate-400">

                        Budget

                    </p>

                    <h2 className="text-xl font-bold">

                        ₹{budgetAmount.toLocaleString()}

                    </h2>

                </div>

                <div>

                    <p className="text-slate-400">

                        Spent

                    </p>

                    <h2 className="text-xl font-bold text-red-400">

                        ₹{totalExpenses.toLocaleString()}

                    </h2>

                </div>

                <div>

                    <p className="text-slate-400">

                        Remaining

                    </p>

                    <h2 className="text-xl font-bold text-green-400">

                        ₹{remaining.toLocaleString()}

                    </h2>

                </div>

            </div>

        </div>

    );

};

export default BudgetProgress;