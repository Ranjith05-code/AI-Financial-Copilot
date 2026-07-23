const RecentTransactions = ({ transactions }) => {

    if (!transactions) return null;

    return (

        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

            <h2 className="text-xl font-semibold mb-4">

                Recent Transactions

            </h2>

            <table className="w-full">

                <thead>

                    <tr className="text-left border-b border-slate-700">

                        <th>Title</th>
                        <th>Category</th>
                        <th>Amount</th>

                    </tr>

                </thead>

                <tbody>

                    {transactions.map((item) => (

                        <tr
                            key={item._id}
                            className="border-b border-slate-700"
                        >

                            <td className="py-3">{item.title}</td>

                            <td>{item.category}</td>

                            <td>₹{item.amount}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default RecentTransactions;