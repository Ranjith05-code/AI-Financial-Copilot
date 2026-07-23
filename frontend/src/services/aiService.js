import api from "./api";

/*
----------------------------------------
Get AI Financial Summary
GET /api/ai
----------------------------------------
*/

export const getFinancialAdvice = async () => {

    const res = await api.get("/ai");

    return res.data;

};

/*
----------------------------------------
Chat With AI
POST /api/ai/chat
----------------------------------------
*/

export const chatWithAI = async (question) => {

    const res = await api.post("/ai/chat", {

        question,

    });

    return res.data;

};