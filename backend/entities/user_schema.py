from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from auth.security import get_password_hash, verify_password
import uuid
class UserRole(str, Enum):
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"

class UserCreate(BaseModel):
    """Schema for safely parsing a new user payload from the frontend frontend router."""
    username: str
    email: EmailStr
    plain_password: str
    role: UserRole = UserRole.CANDIDATE

    def to_document(self) -> "UserDocument":
        """Converts the plaintext creation request seamlessly into a deeply secure NoSQL Document."""
        return UserDocument(
            username=self.username,
            email=self.email,
            hashed_password=get_password_hash(self.plain_password),
            role=self.role
        )

class ResumeFile(BaseModel):
    """Sub-document to store the raw resume file data directly in MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    content_type: str
    file_bytes: bytes  # Motor will automatically store this as BSON Binary data natively
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = False

class UserProfile(BaseModel):
    """Nested sub-document for personal details."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resumes: List[ResumeFile] = Field(default_factory=list, description="Array of historical and active resumes")
    skills: List[str] = Field(default_factory=list)

    def get_active_resume(self) -> Optional[ResumeFile]:
        """Helper to quickly fetch the currently active resume from the array."""
        for resume in self.resumes:
            if resume.is_active:
                return resume
        return None

class UserPreferences(BaseModel):
    """Nested sub-document for settings/preferences."""
    email_notifications: bool = True
    theme: str = "dark"
    preferred_interview_roles: List[str] = Field(default_factory=list)

class UserDocument(BaseModel):
    """
    The main schema for a User document in the MongoDB 'users' collection.
    It demonstrates NoSQL strengths by nesting profile and preference data 
    directly within the single user document.
    """
    id: Optional[str] = Field(alias="_id", default=None)
    username: str
    email: EmailStr
    hashed_password: str
    
    role: UserRole = UserRole.CANDIDATE
    is_verified: bool = False
    
    # Nested Sub-Documents (Great for NoSQL performance, avoids SQL JOINs)
    profile: UserProfile = Field(default_factory=UserProfile)
    preferences: UserPreferences = Field(default_factory=UserPreferences)
 
    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "username": "johndoe",
                "email": "john.doe@example.com",
                "hashed_password": "super_secret_hash",
                "role": "candidate",
                "profile": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "skills": ["Python", "React", "MongoDB"]
                }
            }
        }
    }

    def check_password(self, plain_password: str) -> bool:
        """Helper to verify passwords directly against the schema instance."""
        return verify_password(plain_password, self.hashed_password)
