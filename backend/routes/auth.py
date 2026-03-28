from fastapi import APIRouter, HTTPException, Depends
from entities.models import UserCreate, UserLogin, UserInDB
from database.mongodb import get_db
from auth.security import get_password_hash, verify_password
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate, db=Depends(get_db)):
    # Check if user already exists
    if await db["users"].find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Hash password (SHA-256)
    hashed_pass = get_password_hash(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_pass
    }
    
    new_user = await db["users"].insert_one(user_doc)
    return {"message": "User created successfully", "user_id": str(new_user.inserted_id)}

@router.post("/login")
async def login(credentials: UserLogin, db=Depends(get_db)):
    # Query by email if an '@' is present in the "username" field, otherwise look up by username
    query_field = "email" if "@" in credentials.username else "username"
    user = await db["users"].find_one({query_field: credentials.username})
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Simple Session ID generation for Hackathon purposes
    # Frontend will save this and return in X-Session-ID header
    session_id = str(user["_id"]) # In a real app we'd map this securely
    return {"message": "Login successful", "session_id": session_id}
