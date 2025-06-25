# Voice Assistant Module

A multi-component voice and text assistant module based on Python (FastAPI/gTTS) and Next.js (React, TypeScript).

---

## Project Structure

```
voice-assistant-module/
│
├── backend/         # Python FastAPI backend, TTS, API
│   ├── app/
│   ├── data/
│   └── static/
│
├── frontend/        # Next.js (React, TypeScript) frontend
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Features

- **Text chat** with assistant (UI, message history, sending messages)
- **Voice chat** (speech recognition, TTS responses, voice commands)
- **Audio playback** of assistant responses (gTTS, mp3)
- **Voice commands** (enable/disable microphone, switch modes)
- **Switch between text and voice assistant modes**
- **Responsive UI** (TailwindCSS)

---

## Quick Start

### Backend

1. Go to the `backend` folder:
    ```sh
    cd backend
    ```

2. Create and activate a virtual environment:
    ```sh
    python -m venv .venv
    .venv\Scripts\activate  # Windows
    source .venv/bin/activate  # Linux/Mac
    ```

3. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Run the FastAPI server:
    ```sh
    uvicorn app.main:app --reload
    ```

### Frontend

1. Go to the `frontend` folder:
    ```sh
    cd frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the dev server:
    ```sh
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configuration

- Set the backend address in the `NEXT_PUBLIC_API_BASE_URL` variable in `frontend/.env.local`, for example:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```

---

## Deployment

- **Frontend** can be deployed to [Vercel](https://vercel.com/) (use the `frontend` folder).
- **Backend** should be deployed separately (e.g., Render, Railway, Heroku, VPS).

---

## Main Dependencies

- **Backend:** FastAPI, gTTS, Uvicorn, etc.
- **Frontend:** Next.js, React, TypeScript, TailwindCSS, etc.
