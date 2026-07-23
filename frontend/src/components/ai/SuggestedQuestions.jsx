const questions = [
    "How can I reduce my monthly expenses?",
    "Analyze my spending habits",
    "How much should I save every month?",
    "Where am I overspending?",
];

const SuggestedQuestions = ({ onAsk }) => {
    return (
        <div className="mb-6">

            <h3 className="text-lg font-semibold mb-4">

                Suggested Questions

            </h3>

            <div className="flex flex-wrap gap-3">

                {questions.map((question, index) => (

                    <button
                        key={index}
                        onClick={() => onAsk(question)}
                        className="bg-slate-800 hover:bg-blue-600 transition px-4 py-2 rounded-xl text-sm"
                    >
                        {question}
                    </button>

                ))}

            </div>

        </div>
    );
};

export default SuggestedQuestions;