const calculateAnalytics = (expenses) => {
    const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const averageExpense =
        expenses.length > 0
            ? totalExpenses / expenses.length
            : 0;

    let highestExpense = null;

    if (expenses.length > 0) {
        highestExpense = expenses.reduce((max, expense) =>
            expense.amount > max.amount ? expense : max
        );
    }

    const categoryTotals = {};

    expenses.forEach((expense) => {
        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const monthlyTotals = {};

    expenses.forEach((expense) => {
        const month = new Date(expense.date).toLocaleString("default", {
            month: "long",
        });

        monthlyTotals[month] =
            (monthlyTotals[month] || 0) + expense.amount;
    });

    const monthlyExpenses = Object.keys(monthlyTotals).map((month) => ({
        month,
        total: monthlyTotals[month],
    }));

    return {
        totalExpenses,
        averageExpense: Number(averageExpense.toFixed(2)),
        highestExpense,
        categoryTotals,
        monthlyExpenses,
    };
};

module.exports = {
    calculateAnalytics,
};