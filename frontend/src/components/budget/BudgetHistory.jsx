const BudgetHistory = ({ budgets }) => {

    return (

        <div className="bg-slate-900 rounded-2xl p-8 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">

                Budget History

            </h2>

            <table className="w-full">

                <thead>

                    <tr className="border-b border-slate-700">

                        <th className="text-left p-3">

                            Month

                        </th>

                        <th className="text-left p-3">

                            Year

                        </th>

                        <th className="text-left p-3">

                            Amount

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        budgets.map((budget) => (

                            <tr
                                key={budget._id}
                                className="border-b border-slate-800"
                            >

                                <td className="p-3">

                                    {budget.month}

                                </td>

                                <td className="p-3">

                                    {budget.year}

                                </td>

                                <td className="p-3 font-semibold text-blue-400">

                                    ₹{budget.amount}

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

};

export default BudgetHistory;