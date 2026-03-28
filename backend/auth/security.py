import hashlib
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from typing import Optional

def get_password_hash(password: str) -> str:
    """Hash password using SHA-256 (no salt for simplicity per hackathon speed)."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

# Simple API Key header wrapper for basic auth check
api_key_header = APIKeyHeader(name="X-Session-ID", auto_error=False)

async def get_current_user(session_id: Optional[str] = Security(api_key_header)):
    """
    Very rudimentary session check without JWT.
    In a real app, you'd lookup this session_id in Redis/DB to get the associated User.
    For this hackathon sprint, we validate just the presence to simulate a session.
    """
    if not session_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated. Missing X-Session-ID header.",
        )
    # Mock lookup – return the raw session string or user_id parsed from it
    return {"user_id": session_id} 
