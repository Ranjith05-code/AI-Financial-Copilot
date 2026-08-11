import { useMemo, useState } from "react";
import { FaSpinner, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

import useExpenses from "../hooks/useExpenses";
import { scanReceipt } from "../services/aiService";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

const categoryOptions = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Investment",
    "Salary",
    "Other",
];

const normalizeCategory = (value) => {
    const category = String(value || "").trim().toLowerCase();

    if (["food", "restaurant", "dining"].includes(category)) return "Food";
    if (["transport", "travel", "fuel", "cab", "uber", "ola", "metro", "bus", "train"].includes(category)) return "Transport";
    if (["shopping", "cloth", "clothes", "fashion", "apparel", "retail", "amazon", "flipkart", "market"].includes(category)) return "Shopping";
    if (["bill", "bills", "rent", "electricity", "water", "internet", "mobile", "emi", "insurance", "loan", "subscription"].includes(category)) return "Bills";
    if (["entertainment", "movie", "streaming", "game", "party", "concert"].includes(category)) return "Entertainment";
    if (["health", "doctor", "medicine", "pharmacy", "hospital"].includes(category)) return "Health";
    if (["education", "course", "school", "college", "book", "stationery", "exam", "tuition"].includes(category)) return "Education";
    if (["investment", "mutual", "sip", "fd", "ppf", "stock", "trading", "crypto"].includes(category)) return "Investment";
    if (["salary", "income", "pay", "bonus", "refund", "freelance", "commission"].includes(category)) return "Salary";

    return "Other";
};

const createEmptyForm = () => ({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    items: "",
    notes: "",
});

const ReceiptScanner = () => {
    const { createExpense } = useExpenses();
    const [formData, setFormData] = useState(createEmptyForm());
    const [loading, setLoading] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [fileName, setFileName] = useState("");

    const canSave = useMemo(() => {
        return formData.title.trim() && Number(formData.amount) > 0;
    }, [formData]);

    const updateForm = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const extractTextFromPdf = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pages = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => ("str" in item ? item.str : ""))
                .join(" ");
            pages.push(pageText);
        }

        return pages.join("\n");
    };

    const extractTextFromImage = async (file) => {
        const worker = await createWorker("eng");
        const result = await worker.recognize(file);
        await worker.terminate();
        return result.data.text;
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        setExtractedData(null);
        setFormData(createEmptyForm());

        try {
            const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
            const receiptText = isPdf
                ? await extractTextFromPdf(file)
                : await extractTextFromImage(file);

            if (!receiptText.trim()) {
                throw new Error("No text could be read from the receipt.");
            }

            const response = await scanReceipt({
                receiptText,
                fileName: file.name,
                saveExpense: false,
            });

            const extracted = response.extractedData || {};
            setExtractedData(extracted);
            setFormData({
                title: extracted.merchant || file.name.replace(/\.[^.]+$/, ""),
                amount: extracted.total || extracted.amount || "",
                category: normalizeCategory(extracted.category || "Food"),
                date: extracted.date || new Date().toISOString().split("T")[0],
                items: Array.isArray(extracted.items) ? extracted.items.join("\n") : "",
                notes: `Scanned receipt from ${extracted.merchant || file.name}`,
            });

            toast.success("Receipt scanned successfully. Review and confirm the extracted details.");
        } catch (error) {
            console.error(error);
            toast.error("Unable to read the receipt. You can enter the details manually.");
        } finally {
            setLoading(false);
            event.target.value = "";
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (!canSave) {
            toast.warning("Please provide a title and amount before saving.");
            return;
        }

        try {
            await createExpense({
                ...formData,
                amount: Number(formData.amount),
                notes: formData.notes || `Scanned receipt from ${formData.title}`,
            });

            setFormData(createEmptyForm());
            setFileName("");
            setExtractedData(null);
            toast.success("Scanned receipt saved as an expense.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save the scanned receipt.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h1 className="text-3xl font-bold">Receipt Scanner</h1>
                <p className="mt-2 text-slate-400">
                    Upload a receipt image or PDF to extract store name, date, amount, category, and items.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-6 py-12 text-center">
                        <FaUpload className="mb-3 text-3xl text-blue-400" />
                        <span className="text-sm text-slate-300">Upload receipt image or PDF</span>
                        <span className="mt-2 text-xs text-slate-500">jpg, jpeg, png, pdf</span>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {loading && (
                        <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-slate-950 p-4 text-slate-300">
                            <FaSpinner className="animate-spin text-blue-400" />
                            <span>Scanning receipt...</span>
                        </div>
                    )}

                    {fileName && !loading && (
                        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
                            <span className="font-semibold text-white">Selected file:</span> {fileName}
                        </div>
                    )}

                    {extractedData && (
                        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                            <div className="mb-2 font-semibold text-white">Extraction Summary</div>
                            <div>Merchant: {extractedData.merchant || "N/A"}</div>
                            <div>Date: {extractedData.date || "N/A"}</div>
                            <div>Amount: ₹{Number(extractedData.total || extractedData.amount || 0).toLocaleString("en-IN")}</div>
                            <div>Category: {extractedData.category || "N/A"}</div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-4">
                        <input
                            className="w-full rounded-lg bg-slate-800 p-3"
                            placeholder="Store / merchant name"
                            value={formData.title}
                            onChange={(e) => updateForm("title", e.target.value)}
                            required
                        />

                        <input
                            className="w-full rounded-lg bg-slate-800 p-3"
                            type="number"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={(e) => updateForm("amount", e.target.value)}
                            required
                        />

                        <select
                            className="w-full rounded-lg bg-slate-800 p-3"
                            value={formData.category}
                            onChange={(e) => updateForm("category", e.target.value)}
                        >
                            {categoryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <input
                            className="w-full rounded-lg bg-slate-800 p-3"
                            type="date"
                            value={formData.date}
                            onChange={(e) => updateForm("date", e.target.value)}
                        />

                        <textarea
                            className="min-h-28 w-full resize-none rounded-lg bg-slate-800 p-3"
                            placeholder="Extracted items"
                            value={formData.items}
                            onChange={(e) => updateForm("items", e.target.value)}
                        />

                        <textarea
                            className="min-h-24 w-full resize-none rounded-lg bg-slate-800 p-3"
                            placeholder="Notes"
                            value={formData.notes}
                            onChange={(e) => updateForm("notes", e.target.value)}
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={!canSave || loading}
                        >
                            Confirm & Save Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReceiptScanner;
