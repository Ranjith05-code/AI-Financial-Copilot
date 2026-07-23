const axios = require("axios");

const {
    buildFinancialPrompt,
    buildChatPrompt,
} = require("../utils/promptBuilder");

const callGroq = async (prompt) => {

    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 500,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data.choices[0].message.content;
};

const generateFinancialAdvice = async (financialData) => {

    const prompt = buildFinancialPrompt(financialData);

    return await callGroq(prompt);

};

const askFinancialQuestion = async (
    financialData,
    question
) => {

    const prompt = buildChatPrompt(
        financialData,
        question
    );

    return await callGroq(prompt);

};

module.exports = {
    generateFinancialAdvice,
    askFinancialQuestion,
};