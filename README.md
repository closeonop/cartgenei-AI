# CartGenie AI 🧞‍♂️🛒

CartGenie AI is a premium, multi-agent AI customer support system designed specifically for e-commerce platforms. It handles complex customer queries—such as order tracking, cancellations, refunds, and policy questions—using advanced LLMs with a dynamic 3D frontend.

## 🚀 Tech Stack

### Frontend (User Interface)
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript / React 18
*   **Styling:** Custom Vanilla CSS (Pure black premium theme, glassmorphism, responsive grid)
*   **3D Graphics:** Spline 3D (`@splinetool/react-spline`) for interactive, scroll-aware 3D backgrounds.
*   **Deployment:** Vercel

### Backend (AI Engine & API)
*   **Framework:** Node.js & Express.js
*   **AI Inference:** Groq SDK (Utilizing high-speed LLMs like LLaMA 3 / Mixtral)
*   **Architecture:** Multi-Agent Pipeline (Intent, Confidence, Response, Escalate)
*   **Database (Mock):** Local JSON files (`orders.json`, `rules.json`)
*   **Security:** CORS enabled for secure cross-origin requests.
*   **Deployment:** Render

---

## 🔌 How the Frontend and Backend Connect

The architecture is built on a standard Client-Server REST API model. Here is the step-by-step flow of how the Chatbot communicates with the AI Brain:

1.  **User Input:** A user types a message in the Next.js Chatbot UI (`src/app/chatbot/page.tsx`).
2.  **API Request:** The React frontend uses the native `fetch()` API to send an asynchronous `POST` request to the backend's live Render URL (`https://cartgenie-backend.onrender.com/api/support`).
3.  **Payload:** The frontend sends a JSON payload containing the user's message and a randomly generated session ID:
    ```json
    {
      "query": "Where is my order ORD101?",
      "sessionId": "session_a1b2c3"
    }
    ```
4.  **Backend Processing:** 
    *   The Node.js Express server receives the request. (The `cors` middleware allows this request to pass through from the Vercel domain).
    *   The backend passes the `query` through the Groq LLM to detect the **Intent** (e.g., `track_order`) and extract **Entities** (e.g., `ORD101`).
    *   It checks `orders.json` to find the status of `ORD101`.
    *   It generates a contextual reply using the Response Agent.
5.  **API Response:** The backend sends a detailed JSON object back to the frontend containing the result.
6.  **UI Update:** The React frontend receives the response, extracts `data.response.customerMessage`, and elegantly appends the bot's reply to the chat window with a smooth scroll animation.

---

## 🛠️ Local Development Setup

### 1. Run the Backend
If you have the backend repository cloned locally:
```bash
cd cartgenie-backend
npm install
# Ensure you have a .env file with GROQ_API_KEY=your_key
npm start
```
*The backend will run on `http://localhost:5001`.*

### 2. Run the Frontend
In this repository:
```bash
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`.*

> **Note on Local Testing:** If you are running both locally, you can temporarily change `API_URL` in `src/app/chatbot/page.tsx` from the Render URL to `http://localhost:5001/api/support`.

---

## 🎨 Design Philosophy
CartGenie was designed with a "Premium Dark" aesthetic. 
*   **Performance:** The heavy Spline 3D scene is deferred and lazy-loaded so it doesn't block the initial page render.
*   **Responsive:** The UI flawlessly adapts from ultrawide desktop monitors down to mobile portrait screens.
*   **Animations:** Micro-animations (like message bubbles fading in, glowing loading dots, and magnetic buttons) are implemented using pure CSS for maximum framerate without JavaScript overhead.

---

## 📝 License
© 2026 CartGenie AI. All rights reserved.
