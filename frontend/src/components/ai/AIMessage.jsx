import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

const AIMessage = ({ sender, text }) => {

    const isUser = sender === "user";

    const [copied, setCopied] = useState(false);

    const copyMessage = async () => {

        try {

            await navigator.clipboard.writeText(text);

            setCopied(true);

            setTimeout(() => {

                setCopied(false);

            }, 2000);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div
            className={`flex ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            } mb-5`}
        >

            <div
                className={`relative w-full max-w-[92%] rounded-2xl px-5 py-4 shadow-lg break-words ${
                    isUser
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-white"
                }`}
            >

                <div className="flex justify-between items-center mb-3">

                    <span className="text-xs opacity-70">

                        {isUser ? "You" : "AI Financial Copilot"}

                    </span>

                    {

                        !isUser && (

                            <button
                                onClick={copyMessage}
                                className="hover:text-blue-400"
                            >

                                {copied ? <FaCheck /> : <FaCopy />}

                            </button>

                        )

                    }

                </div>

                <p className="whitespace-pre-wrap leading-7">

                    {text}

                </p>

            </div>

        </div>

    );

};

export default AIMessage;