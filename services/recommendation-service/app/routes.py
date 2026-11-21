from fastapi import APIRouter, Query, Body, HTTPException
from typing import Optional, Dict, Any
from app.engine import generate_recommendations, calculate_shelfmatch
from app.events import handle_domain_event

router = APIRouter()

@router.get("/recommendations")
def get_recommendations(userId: Optional[str] = Query("user_elena_vance")):
    """NextRead personalized book and adaptation recommendations with explainable reasons."""
    try:
        results = generate_recommendations(userId)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/shelfmatch")
def get_shelfmatch(userId: Optional[str] = Query("user_elena_vance")):
    """ShelfMatch reader compatibility analysis with overlapping tastes and discoveries."""
    try:
        matches = calculate_shelfmatch(userId)
        return {
            "userId": userId,
            "matches": matches
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating ShelfMatch: {str(e)}")

@router.post("/recommendations/events")
def receive_event_webhook(event: Dict[str, Any] = Body(...)):
    """Direct HTTP event webhook ingestion for local testing and zero-delay broadcast."""
    success = handle_domain_event(event)
    return {"received": True, "processed": success}
