import { useEffect } from "react";

import AIChatBox from "../components/ai/AIChatBox";

import useAI from "../hooks/useAI";

const AIAdvisor = () => {

    const {

        messages,

        loading,

        loadAdvice,

        sendMessage,

        clearChat,

    } = useAI();

    useEffect(() => {

        loadAdvice();

    }, []);

    return (

        <div className="flex flex-col h-full">

                <div className="mb-8">

                    <h1 className="text-4xl font-bold">

                        AI Financial Advisor

                    </h1>

                    <p className="text-slate-400 mt-2">

                        Powered by Groq AI

                    </p>

                </div>

                <div className="flex-1 min-h-0">

                    <AIChatBox

                        messages={messages}

                        loading={loading}

                        onSend={sendMessage}

                        onClear={clearChat}

                    />

                </div>

        </div>

    );

};

export default AIAdvisor;