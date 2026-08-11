import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { predictExpenseCategory } from "../../services/aiService";

Modal.setAppElement("#root");

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

const AddExpenseModal = ({
    isOpen,
    onClose,
    onSave,
}) => {

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        notes: "",
    });
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getVoiceCategory = (text) => {
        const normalized = text.toLowerCase();

        if (/(petrol|fuel|train|bus|metro|cab|uber|ola|ride|taxi)/.test(normalized)) return "Transport";
        if (/(food|pizza|burger|coffee|lunch|dinner|restaurant|snacks|meal)/.test(normalized)) return "Food";
        if (/(cloth|shirt|dress|jeans|shoes|fashion|shopping|market|amazon|flipkart)/.test(normalized)) return "Shopping";
        if (/(bill|rent|electric|water|internet|mobile|insurance|loan|emi|subscription)/.test(normalized)) return "Bills";
        if (/(movie|game|party|concert|stream|entertainment)/.test(normalized)) return "Entertainment";
        if (/(doctor|medicine|pharmacy|hospital|health)/.test(normalized)) return "Health";
        if (/(school|college|course|book|tuition|education)/.test(normalized)) return "Education";
        if (/(investment|mutual|sip|stock|fd|ppf|trading|crypto)/.test(normalized)) return "Investment";

        return "Other";
    };

    const getVoiceDate = (text) => {
        const normalized = text.toLowerCase();
        const today = new Date();

        if (/(today|now)/.test(normalized)) return today.toISOString().split("T")[0];

        if (/(yesterday)/.test(normalized)) {
            const date = new Date(today);
            date.setDate(today.getDate() - 1);
            return date.toISOString().split("T")[0];
        }

        if (/(tomorrow)/.test(normalized)) {
            const date = new Date(today);
            date.setDate(today.getDate() + 1);
            return date.toISOString().split("T")[0];
        }

        const dateMatch = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/);
        if (dateMatch) {
            const [_, first, second, year] = dateMatch;
            const parsedDate = new Date(`${year}-${first}-${second}`);
            if (!Number.isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split("T")[0];
            }
        }

        return null;
    };

    const getVoiceTitle = (text) => {
        const normalized = text.replace(/\b(i|spent|paid|made|bought|for|on)\b/gi, " ").trim();
        const cleaned = normalized
            .replace(/\b(rupees?|rs\.?|inr)\b/gi, "")
            .replace(/\b(\d+(?:\.\d+)?)\b/g, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!cleaned) {
            return "Expense";
        }

        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    };

    const stopVoiceRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setListening(false);
    };

    const startVoiceRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Speech recognition is not supported in this browser.");
            return;
        }

        if (recognitionRef.current) {
            stopVoiceRecognition();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            toast.info("Listening for your expense details...");
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0]?.transcript || "")
                .join(" ")
                .trim();

            if (!transcript) return;

            const amountMatch = transcript.match(/(\d+(?:\.\d+)?)/);
            const amount = amountMatch ? amountMatch[1] : "";
            const detectedCategory = getVoiceCategory(transcript);
            const inferredDate = getVoiceDate(transcript);
            const inferredTitle = getVoiceTitle(transcript);

            setFormData((prev) => ({
                ...prev,
                title: inferredTitle,
                amount,
                category: detectedCategory,
                date: inferredDate || prev.date,
            }));

            toast.success("Voice expense details populated. You can edit before saving.");
        };

        recognition.onerror = () => {
            stopVoiceRecognition();
            toast.error("Unable to capture voice input. Try again.");
        };

        recognition.onend = () => {
            stopVoiceRecognition();
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const applyPrediction = async (title, notes, showToast = false) => {
        if (!title.trim()) {
            return;
        }

        setLoadingPrediction(true);
        try {
            const res = await predictExpenseCategory(title, notes);
            const result = res.prediction;
            setPrediction(result);
            setFormData((prev) => ({
                ...prev,
                category: normalizeCategory(result.predictedCategory || prev.category),
            }));

            if (showToast) {
                if (result.confidenceScore < 70) {
                    toast.info(`Low confidence. Suggested categories: ${result.topCategories?.join(", ")}`);
                } else {
                    toast.success(`AI predicted ${result.predictedCategory} with ${result.confidenceScore}% confidence.`);
                }
            }
        } catch (error) {
            console.error(error);
            if (showToast) {
                toast.error("Unable to predict category right now.");
            }
        } finally {
            setLoadingPrediction(false);
        }
    };

    useEffect(() => {
        if (formData.title.trim().length < 2) {
            return undefined;
        }

        const timer = setTimeout(() => {
            applyPrediction(formData.title, formData.notes);
        }, 600);

        return () => clearTimeout(timer);
    }, [formData.title, formData.notes]);

    const handlePredictCategory = async () => {
        if (!formData.title.trim()) {
            toast.warning("Enter an expense title first.");
            return;
        }

        await applyPrediction(formData.title, formData.notes, true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            ...formData,
            amount: Number(formData.amount),
        });

        setFormData({
            title: "",
            amount: "",
            category: "Food",
            date: new Date().toISOString().split("T")[0],
            notes: "",
        });
        setPrediction(null);
        onClose();
    };

    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                content: {
                    width: "500px",
                    margin: "auto",
                    height: "600px",
                    borderRadius: "20px",
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                },
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.6)",
                },
            }}
        >

            <h2 className="text-3xl font-bold mb-8">

                Add Expense

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    placeholder="Amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />

                <div className="flex items-center gap-3">
                    <select
                        className="w-full p-3 rounded-lg bg-slate-800"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Shopping</option>
                        <option>Bills</option>
                        <option>Entertainment</option>
                        <option>Health</option>
                        <option>Education</option>
                        <option>Investment</option>
                        <option>Salary</option>
                        <option>Other</option>
                    </select>
                    <button
                        type="button"
                        onClick={startVoiceRecognition}
                        className="rounded-lg bg-purple-600 px-3 py-3 text-sm font-semibold"
                        title="Use voice expense entry"
                    >
                        {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                    <button
                        type="button"
                        onClick={handlePredictCategory}
                        className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold"
                        disabled={loadingPrediction}
                    >
                        {loadingPrediction ? "Auto-detecting..." : "AI Predict"}
                    </button>
                </div>
                {prediction && (
                    <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-sm text-slate-300">
                        <div>Category: <span className="font-semibold text-white">{prediction.predictedCategory}</span></div>
                        <div>Merchant: <span className="font-semibold text-white">{prediction.merchant || "N/A"}</span></div>
                        <div>Type: <span className="font-semibold text-white">{prediction.expenseType || "N/A"}</span></div>
                        <div>Confidence: <span className="font-semibold text-white">{prediction.confidenceScore}%</span></div>
                        {prediction.confidenceScore < 70 && (
                            <div className="mt-1">Alternatives: {prediction.topCategories?.join(", ")}</div>
                        )}
                    </div>
                )}

                <input
                    className="w-full p-3 rounded-lg bg-slate-800"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <textarea
                    className="w-full p-3 rounded-lg bg-slate-800 resize-none"
                    placeholder="Notes (optional)"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-4 pt-5">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-gray-600"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-blue-600"
                    >

                        Save Expense

                    </button>

                </div>

            </form>

        </Modal>

    );

};

export default AddExpenseModal;