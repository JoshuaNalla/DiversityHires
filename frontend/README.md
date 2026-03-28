# IntervAI Frontend (HackPSU 2026)

This repository contains the React frontend for **IntervAI**, built with Vite and styled via Tailwind CSS. The interface interacts with the FastAPI backend, ElevenLabs for voice output, and OpenFace for capturing real-time biometric metrics.

---

## 🚀 Setup & Installation

### 1. Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (v9 or higher recommended)

### 2. Install Dependencies
Navigate to the `frontend` directory and install the necessary Node modules:

```bash
cd frontend
npm install
```

### 3. Environment Variables
If your React application needs access to standard external configurations (e.g., pointing to the local backend URL), create a `.env` file in the root of the `frontend/` directory. For example:

```ini
VITE_API_URL=http://localhost:8000
```
> **Note**: Vite environment variables must be prefixed with `VITE_` to be exposed to your application code.

---

## 🏃‍♂️ Running the Development Server

Start the local Vite development environment with hot-module replacement (HMR):

```bash
npm run dev
```

The app will typically be available at `http://localhost:5173`.

---

## 🏗️ Building for Production

To create an optimized production build (e.g., when deploying to Vercel, Netlify, or similar platforms), run:

```bash
npm run build
```

This will output static files into the `dist/` directory.

---

## 🔌 Integrating with the Backend

*   **REST Architecture**: Standard API requests (like authentication) should point to the backend's `/api/auth` endpoints running on port `8000`.
*   **WebSockets**: Real-time biometric streaming and AI text-to-speech rendering require establishing a WebSocket connection with the `ws://localhost:8000/api/interview/ws` endpoint. Ensure OpenFace JSON payloads and speech-to-text inputs are routed here.
