# chatbot_service.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="Revora Adventure Trip Planner Chatbot")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    user_id: str
    from_location: str
    to_location: str
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str
    trip_details: Dict[str, Any]

# System prompt for the adventure trip planner
SYSTEM_PROMPT = """You are AdventureTripPlanner-GPT, an expert long-distance motorcycle route and itinerary planner for the Revora platform. 
Ask the user step-by-step questions about their journey: origin, destination, days, riding limit, 
bike type, budget, preferences, and start date. Based on the answers, generate a detailed daily 
plan including distances, meal stops, hotels, refueling points, cost estimates, and a trip summary. 
Keep it realistic, region-aware, and formatted neatly with emojis and cost tables. 
If any detail is missing, ask before proceeding. 
At the end, show total cost and 10% buffer for contingencies.

Your responses should be conversational, adventurous, and informative.
Use icons (🏍, ⛽, 🏨, 🍳) to break up sections.
Maintain cost transparency (₹ breakdowns).
Add local flavor — famous cafés, dhabas, landmarks.
Include realistic riding notes for weather & terrain."""

@app.post("/chat/start")
async def start_chat(request: ChatRequest):
    """Start a new chat session for trip planning"""
    try:
        # Initialize conversation with system prompt and user's initial message
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"I'm planning to ride from {request.from_location} to {request.to_location}"}
        ]
        
        # Get response from GPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,  # type: ignore
            temperature=0.7,
            max_tokens=500
        )
        
        ai_response = response.choices[0].message.content or ""
        
        return ChatResponse(
            response=ai_response,
            trip_details={
                "from_location": request.from_location,
                "to_location": request.to_location,
                "status": "started"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/message")
async def continue_chat(request: ChatRequest):
    """Continue an existing chat session"""
    try:
        # Prepare messages for GPT (include system prompt)
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Get response from GPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,  # type: ignore
            temperature=0.7,
            max_tokens=800
        )
        
        ai_response = response.choices[0].message.content or ""
        
        # Extract trip details from the conversation if completed
        trip_details = extract_trip_details(messages + [{"role": "assistant", "content": ai_response}])
        
        return ChatResponse(
            response=ai_response,
            trip_details=trip_details
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extract_trip_details(messages):
    """Extract trip details from conversation (simplified version)"""
    # In a real implementation, you would parse the conversation to extract structured data
    # This is a placeholder implementation
    return {
        "status": "in_progress",
        "extracted_info": "Trip details would be extracted here"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)