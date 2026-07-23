import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getFinancialAdvice,
    chatWithAI,
} from "../services/aiService";

const STORAGE_KEY = "ai_chat_history";

const useAI = () => {

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {

            setMessages(JSON.parse(saved));

        }

    }, []);

    useEffect(() => {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(messages)
        );

    }, [messages]);

    const loadAdvice = async () => {

        if (messages.length > 0) return;

        try {

            setLoading(true);

            const res = await getFinancialAdvice();

            setMessages([
                {
                    sender: "ai",
                    text: res.advice,
                },
            ]);

        } catch (error) {

            console.error(error);

            toast.error("Unable to load AI advice.");

        } finally {

            setLoading(false);

        }

    };

    const sendMessage = async (question) => {

        if (!question.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: question,
            },
        ]);

        setLoading(true);

        try {

            const res = await chatWithAI(question);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: res.answer,
                },
            ]);

        } catch (error) {

            console.error(error);

            toast.error("AI service is currently unavailable.");

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't process your request right now.",
                },
            ]);

        } finally {

            setLoading(false);

        }

    };

    const clearChat = () => {

        localStorage.removeItem(STORAGE_KEY);

        setMessages([]);

        toast.success("Chat history cleared.");

    };

    return {

        messages,

        loading,

        loadAdvice,

        sendMessage,

        clearChat,

    };

};

export default useAI;