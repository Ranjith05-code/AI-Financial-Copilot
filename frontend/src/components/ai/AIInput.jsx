import { useState } from "react";

const AIInput = ({ onSend, loading }) => {

    const [question, setQuestion] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!question.trim()) return;

        onSend(question);

        setQuestion("");

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="flex gap-4 mt-6"
        >

            <input
                type="text"
                placeholder="Ask anything about your finances..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 bg-slate-800 rounded-xl p-4 outline-none border border-slate-700 focus:border-blue-500"
            />

            <button
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-8 rounded-xl font-semibold transition-all disabled:opacity-60"
            >

                {loading ? "..." : "Send"}

            </button>

        </form>

    );

};

export default AIInput;