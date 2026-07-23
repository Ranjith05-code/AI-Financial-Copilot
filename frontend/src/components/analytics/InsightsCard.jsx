const InsightsCard = ({ dashboard }) => {

    if (!dashboard) return null;

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Financial Insights

            </h2>

            <div className="space-y-5">

                <div className="bg-slate-800 rounded-xl p-4">

                    <p className="text-slate-400">

                        Total Expenses

                    </p>

                    <h3 className="text-2xl font-bold mt-2">

                        ₹{dashboard.totalExpenses}

                    </h3>

                </div>

                <div className="bg-slate-800 rounded-xl p-4">

                    <p className="text-slate-400">

                        Remaining Budget

                    </p>

                    <h3 className="text-2xl font-bold mt-2">

                        ₹{dashboard.remainingBudget}

                    </h3>

                </div>

                <div className="bg-slate-800 rounded-xl p-4">

                    <p className="text-slate-400">

                        Highest Spending Category

                    </p>

                    <h3 className="text-2xl font-bold mt-2">

                        {dashboard.topCategory || "N/A"}

                    </h3>

                </div>

                <div className="bg-slate-800 rounded-xl p-4">

                    <p className="text-slate-400">

                        Total Transactions

                    </p>

                    <h3 className="text-2xl font-bold mt-2">

                        {dashboard.totalTransactions}

                    </h3>

                </div>

            </div>

        </div>

    );

};

export default InsightsCard;