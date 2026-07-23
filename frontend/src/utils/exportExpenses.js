import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ===========================
// CSV Export
// ===========================

export const exportExpensesToCSV = (expenses) => {

    if (!expenses.length) return;

    const headers = [
        "Title",
        "Amount",
        "Category",
        "Date",
    ];

    const rows = expenses.map((expense) => ([
        expense.title,
        expense.amount,
        expense.category,
        new Date(expense.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
    ]));

    const csvContent = [
        headers,
        ...rows,
    ]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;",
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Expense_Report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

};

// ===========================
// PDF Export
// ===========================

export const exportExpensesToPDF = (expenses) => {

    if (!expenses.length) return;

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Expense Report", 14, 20);

    autoTable(doc, {

        head: [[
            "Title",
            "Amount",
            "Category",
            "Date",
        ]],

        body: expenses.map((expense) => ([
            expense.title,
            `₹ ${expense.amount}`,
            expense.category,
            new Date(expense.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        ])),

        startY: 30,

        theme: "striped",

        headStyles: {

            fillColor: [37, 99, 235],

            textColor: 255,

            fontStyle: "bold",

        },

        styles: {

            fontSize: 11,

            cellPadding: 3,

        },

    });

    doc.save("Expense_Report.pdf");

};

// ===========================
// Excel Export (.xlsx)
// ===========================

export const exportExpensesToExcel = (expenses) => {

    if (!expenses.length) return;

    const data = expenses.map((expense) => ({

        Title: expense.title,

        Amount: expense.amount,

        Category: expense.category,

        Date: new Date(expense.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Expenses"
    );

    XLSX.writeFile(
        workbook,
        "Expense_Report.xlsx"
    );

};