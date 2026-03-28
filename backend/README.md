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

### 1. Prerequisites & Tool Installation

Before you can run the backend, ensure your system has the following core dependencies installed:

*   **Python 3.10+**: Core runtime for our FastAPI application.
    *   *Mac*: Install via Homebrew (`brew install python@3.11`) or download directly from [python.org](https://www.python.org/downloads/).
    *   *Windows*: Download the executable from the official site. **Important**: Check the box that says "Add Python to PATH" during installation.
*   **Docker Desktop**: We use containerization to run the MongoDB database seamlessly (and later, the MediaPipe service) without needing manual database setups.
    *   Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/).
    *   Make sure the Docker application is open and running in the background before proceeding.
*   *(Optional but needed for frontend)* **Node.js**: If you intend to run the Vue/React UI alongside the system locally, you will need Node and npm. Download the LTS version from [nodejs.org](https://nodejs.org/).

### 2. Start the Database (Docker)
We use Docker Compose to spin up MongoDB (and eventually your teammate's MediaPipe service). Open a terminal in the root of the project and run:

```bash
docker-compose up -d
```
*(This starts MongoDB on `mongodb://localhost:27017` in the background).*

### 3. Virtual Environment
Navigate to this `backend` directory and create/activate a virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
Install all required libraries for the Hackathon:

```bash
pip install -r requirements.txt
```

### 5. Environment Variables
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
