from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- authentication models ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: str = Field(alias="_id")
    username: str
    email: EmailStr
    hashed_password: str

class UserLogin(BaseModel):
    username: str
    password: str

class TokenData(BaseModel):
    username: Optional[str] = None
    session_id: str

# --- interview models ---
class BiometricData(BaseModel):
    timestamp: float
    confidence: float
    success: int
    action_units: Dict[str, float]
    head_pose: Dict[str, float]

class InterviewTranscriptEntry(BaseModel):
    speaker: str # "AI" or "User"
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    biometrics: Optional[BiometricData] = None

class InterviewSession(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    status: str = "active" # active, completed
    transcript: List[InterviewTranscriptEntry] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EvaluationReport(BaseModel):
    interview_id: str
    performance_score: int
    confidence_score: int
    detailed_feedback: str
    growth_plan_sent: bool = False
