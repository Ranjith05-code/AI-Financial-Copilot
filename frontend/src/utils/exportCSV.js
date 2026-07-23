export const exportCSV = (expenses) => {

    if (!expenses.length) return;

    const headers = [
        "Title",
        "Amount",
        "Category",
        "Date",
    ];

    const rows = expenses.map((expense) => [

        expense.title,

        expense.amount,

        expense.category,

        new Date(expense.date).toLocaleDateString(),

    ]);

    const csvContent = [

        headers,

        ...rows,

    ]
        .map((row) => row.join(","))

        .join("\n");

    const blob = new Blob(

        [csvContent],

        { type: "text/csv;charset=utf-8;" }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "expenses.csv";

    link.click();

    URL.revokeObjectURL(url);

};