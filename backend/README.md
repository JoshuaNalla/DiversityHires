# IntervAI Backend (HackPSU 2026)

This repository contains the FastAPI backend for **IntervAI**, an AI-driven interview preparation and biometric analysis tool. It is designed to act as a "Senior Technical Interviewer" with capabilities for multimodal processing, low-latency voice, and autonomous post-interview follow-ups.

## Features & Integrations
*   **FastAPI & MongoDB**: High-performance asynchronous API using Motor (MongoDB async driver).
*   **Gemini API (Google)**: Powers the conversational AI interviewer and generates the post-interview Confidence vs. Performance report based on biometric cues.
*   **ElevenLabs API**: Provides low-latency, realistic AI interviewer voices streamed via WebSockets.
*   **OpenClaw**: An autonomous agent integration that sends follow-up "Growth Plan" emails to candidates.
*   **OpenFace Compatible**: Endpoints designed to receive real-time JSON payloads of action units (AUs), head pose, and confidence metrics.

---

## 🚀 Setup & Installation

### 1. Prerequisites
*   Python 3.10+
*   MongoDB running locally (default: `mongodb://localhost:27017`)

### 2. Virtual Environment
Navigate to this `backend` directory and create/activate a virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
Install all required libraries for the Hackathon:

```bash
pip install -r requirements.txt
```

### 4. Environment Variables
You MUST create a `.env` file in the root of the `backend/` directory. Use the following template and insert your actual API keys:

```ini
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=intervai
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
OPENCLAW_API_KEY=your_openclaw_api_key_here
```

---

## 🏃‍♂️ Running the Server

Start the development server using `uvicorn`:

```bash
uvicorn app:app --reload
```

The API will run on `http://127.0.0.1:8000`.

### API Documentation
FastAPI instantly generates interactive Swagger documentation. This is extremely helpful for your frontend teammates!

*   **Swagger UI**: `http://127.0.0.1:8000/docs`
*   **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 🔌 Key Endpoints

### Authentication (No JWT, fast SHA-256)
*   **`POST /api/auth/register`**: Registers a new user with `username`, `email`, and `password`.
*   **`POST /api/auth/login`**: Authenticates and returns a `session_id`. Use this `session_id` in the `X-Session-ID` Header for authenticated routes.

### Interview Stream & Processing
*   **`WS /api/interview/ws`**: The core WebSocket integration.
    *   **Receives**: JSON containing `{ "text": "candidate response", "biometrics": { ... OpenFace data ... } }`.
    *   **Returns**: Real-time AI response text fragments and Base64 encoded audio snippets triggered by ElevenLabs.
*   **`POST /api/interview/finalize/{interview_id}`**: Wraps up the session by pulling the conversation transcript + OpenFace biometric averages from Mongo, requests a "Confidence vs Performance" JSON report from Gemini, and finally triggers OpenClaw to email the Growth Plan.
