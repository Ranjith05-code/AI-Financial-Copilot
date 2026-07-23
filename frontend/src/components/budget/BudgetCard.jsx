const BudgetCard = ({ budget }) => {

    if (!budget) {

        return (

            <div className="bg-slate-900 rounded-2xl p-8 shadow-lg">

                <h2 className="text-2xl font-bold">

                    No Budget Found

                </h2>

                <p className="text-slate-400 mt-2">

                    Create your first monthly budget.

                </p>

            </div>

        );

    }

    return (

        <div className="bg-slate-900 rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold">

                Monthly Budget

            </h2>

            <div className="mt-8">

                <h1 className="text-5xl font-bold text-blue-400">

                    ₹{budget.amount.toLocaleString()}

                </h1>

                <p className="text-slate-400 mt-3">

                    {budget.month}/{budget.year}

                </p>

            </div>

        </div>

    );

};

export default BudgetCard;