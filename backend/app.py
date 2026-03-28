import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.mongodb import connect_to_mongo, close_mongo_connection
from routes import auth, interview

# Initialize FastAPI App
app = FastAPI(
    title="IntervAI Backend",
    description="HackPSU 2026 AI Interviewer API",
    version="1.0.0"
)

# Allow CORS for everything (Frontend dev)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Fast Hackathon Setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lifespan Hook
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include Routers
app.include_router(auth.router)
app.include_router(interview.router)

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "IntervAI Backend is running!"}
