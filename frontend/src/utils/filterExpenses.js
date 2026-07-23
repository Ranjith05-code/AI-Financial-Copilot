const filterExpenses = (expenses, filters = {}) => {

    const {

        search = "",

        category = "All",

        sortBy = "date",

        order = "desc",

    } = filters;

    let filtered = [...expenses];

    // ==========================
    // Search by Title
    // ==========================

    if (search.trim()) {

        filtered = filtered.filter((expense) =>

            expense.title
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }

    // ==========================
    // Category Filter
    // ==========================

    if (category !== "All") {

        filtered = filtered.filter(

            (expense) => expense.category === category

        );

    }

    // ==========================
    // Sorting
    // ==========================

    filtered.sort((a, b) => {

        let comparison = 0;

        if (sortBy === "amount") {

            comparison = a.amount - b.amount;

        }

        else if (sortBy === "date") {

            comparison =

                new Date(a.date) -

                new Date(b.date);

        }

        else if (sortBy === "title") {

            comparison = a.title.localeCompare(b.title);

        }

        return order === "asc"

            ? comparison

            : -comparison;

    });

    return filtered;

};

export default filterExpenses;