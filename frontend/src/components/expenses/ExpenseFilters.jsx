import { useEffect, useState } from "react";

import filterExpenses from "../../utils/filterExpenses";

const ExpenseFilters = ({
    expenses,
    setFilteredExpenses,
}) => {

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const [sortBy, setSortBy] = useState("date");

    const [order, setOrder] = useState("desc");

    const categories = [

        "All",

        ...new Set(
            expenses.map((expense) => expense.category)
        ),

    ];

    useEffect(() => {

        const filtered = filterExpenses(expenses, { search, category, sortBy, order });

        setFilteredExpenses(filtered);

    }, [expenses, search, category, sortBy, order]);

    return (

        <div className="bg-slate-900 rounded-xl p-5 mt-6">

            <div className="grid md:grid-cols-4 gap-4">

                {/* Search */}

                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

                {/* Category */}

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                >

                    {

                        categories.map((cat) => (

                            <option
                                key={cat}
                                value={cat}
                            >

                                {cat}

                            </option>

                        ))

                    }

                </select>

                {/* Sort */}

                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                >

                    <option value="date">

                        Date

                    </option>

                    <option value="amount">

                        Amount

                    </option>

                </select>

                {/* Order */}

                <select
                    value={order}
                    onChange={(e) =>
                        setOrder(e.target.value)
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                >

                    <option value="desc">

                        Descending

                    </option>

                    <option value="asc">

                        Ascending

                    </option>

                </select>

            </div>

        </div>

    );

};

export default ExpenseFilters;