import { useEffect, useRef } from "react";

import AIMessage from "./AIMessage";
import AIInput from "./AIInput";
import TypingIndicator from "./TypingIndicator";
import SuggestedQuestions from "./SuggestedQuestions";

const AIChatBox = ({
    messages,
    loading,
    onSend,
    onClear,
}) => {

    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, loading]);

    return (

        <div className="h-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            <div className="border-b border-slate-700 p-6 flex justify-between items-center">

                <div>

                    <h2 className="text-2xl font-bold">

                        🤖 AI Financial Copilot

                    </h2>

                    <p className="text-slate-400 mt-2">

                        Ask anything about your spending, budget or savings.

                    </p>

                </div>

                <button

                    onClick={onClear}

                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"

                >

                    Clear Chat

                </button>

            </div>

            <div className="border-b border-slate-700 p-6">

                <SuggestedQuestions
                    onAsk={onSend}
                />

            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-0">

                {

                    messages.map((message, index) => (

                        <AIMessage

                            key={index}

                            sender={message.sender}

                            text={message.text}

                        />

                    ))

                }

                {

                    loading &&

                    <TypingIndicator />

                }

                <div ref={bottomRef} />

            </div>

            <div className="border-t border-slate-700 p-5">

                <AIInput

                    onSend={onSend}

                    loading={loading}

                />

            </div>

        </div>

    );

};

export default AIChatBox;