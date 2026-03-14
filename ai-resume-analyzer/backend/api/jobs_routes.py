from fastapi import APIRouter, HTTPException
from typing import List, Optional
from services.job_service import get_job_recommendations

router = APIRouter()

@router.post("/recommend")
async def recommend_jobs(payload: dict):
    """Get job recommendations based on skills"""
    skills = payload.get("skills", [])
    limit = min(payload.get("limit", 8), 20)
    if not skills:
        raise HTTPException(status_code=400, detail="Skills list is required")
    jobs = await get_job_recommendations(skills, limit)
    return {"jobs": jobs, "total": len(jobs)}

@router.get("/search")
async def search_jobs(q: str, limit: int = 10):
    """Search jobs by query"""
    skills = q.split(",") if "," in q else [q]
    jobs = await get_job_recommendations([s.strip() for s in skills], limit)
    return {"jobs": jobs}
