from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# 1. Load Secrets
load_dotenv()

app = FastAPI(title="MCD-Sahayak Brain")

# 2. Allow Frontend to talk to Backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Connect to Supabase Database
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Safety check: Only connect if keys exist
if url and key:
    supabase: Client = create_client(url, key)
else:
    print("WARNING: Supabase keys not found. Database features will fail.")
    supabase = None

# 4. Define Data Model (What a complaint looks like)
class Complaint(BaseModel):
    location: str
    issue: str
    urgency: str

@app.get("/")
def read_root():
    return {"status": "MCD Brain Online", "version": "1.0"}

@app.post("/api/log-complaint")
def log_complaint(data: Complaint):
    """
    Receives data from Voice Agent and saves to DB
    """
    if not supabase:
        return {"error": "Database not connected"}
    
    try:
        response = supabase.table("complaints").insert({
            "location": data.location,
            "issue": data.issue,
            "urgency": data.urgency,
            "status": "Open"
        }).execute()
        # Fix for Supabase response format
        return {"message": "Logged Successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard-stats")
def get_stats():
    """
    Feeds the Next.js Dashboard with live counts
    """
    # Later we will fetch real counts from DB. 
    # For now, returning dummy data to test Frontend.
    return {
        "total_complaints": 124,
        "resolved": 98,
        "pending": 26,
        "critical_zones": ["Dwarka", "Rohini"]
    }