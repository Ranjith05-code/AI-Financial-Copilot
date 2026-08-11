# AI Financial Copilot

An AI-powered personal finance assistant built with the MERN stack.

## Features

- AI expense category prediction
- Voice-enabled expense entry
- AI receipt scanner
- Monthly and yearly AI reports
- AI spending forecast
- AI savings planner
- Smart alerts and dashboard notifications
- Toast pop-up alerts

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB
- AI: Groq API
- PDF export: jsPDF + jspdf-autotable
- Notifications: React Toastify

## Project Structure

- `backend/` — Express API, MongoDB models, controllers, services
- `frontend/` — Vite React application

## Run the Project

1. Install dependencies in both folders:
   - `cd backend && npm install`
   - `cd frontend && npm install`

2. Create a `.env` file in `backend` using the environment variables shown in `.env.example`.

3. Start the backend:
   - `cd backend && npm start`

4. Start the frontend:
   - `cd frontend && npm run dev`

5. Open the frontend in your browser at the Vite local URL.

## Production-Ready Notes

This is a strong MVP / demo-grade GenAI project. For production, the next recommended improvements are:

- secure deployment and environment separation
- automated tests and CI/CD
- stronger AI fallback handling
- better monitoring and logging
- rate limiting and abuse protection
