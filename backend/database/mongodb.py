import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "intervai")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_config = Database()

async def connect_to_mongo():
    db_config.client = AsyncIOMotorClient(MONGO_URL)
    db_config.db = db_config.client[DATABASE_NAME]
    print(f"Connected to MongoDB at {MONGO_URL}")

async def close_mongo_connection():
    if db_config.client:
        db_config.client.close()
        print("MongoDB connection closed")

def get_db():
    return db_config.db
