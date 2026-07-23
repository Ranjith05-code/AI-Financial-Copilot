import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (expenses) => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Expense Report", 14, 20);

    autoTable(doc, {

        head: [[

            "Title",

            "Amount",

            "Category",

            "Date",

        ]],

        body: expenses.map((expense) => [

            expense.title,

            `₹${expense.amount}`,

            expense.category,

            new Date(expense.date).toLocaleDateString(),

        ]),

        startY: 30,

    });

    doc.save("expenses.pdf");

};