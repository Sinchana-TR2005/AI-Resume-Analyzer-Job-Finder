from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
import logging

from services.resume_parser import (
    extract_text_from_pdf, extract_text_from_docx,
    calculate_ats_score, extract_email, extract_phone,
    extract_linkedin, extract_github, estimate_experience_years
)
from services.ai_service import analyze_resume_with_ai, extract_skills_from_text

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc"
}

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze a resume file"""
    content_type = file.content_type or ""
    filename = file.filename or ""

    # Determine file type
    if content_type in ALLOWED_TYPES:
        file_type = ALLOWED_TYPES[content_type]
    elif filename.endswith(".pdf"):
        file_type = "pdf"
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        file_type = "docx"
    else:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    if file.size and file.size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size must be under 10MB")

    file_bytes = await file.read()

    # Extract text
    if file_type == "pdf":
        text = extract_text_from_pdf(file_bytes)
    else:
        text = extract_text_from_docx(file_bytes)

    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract text from the resume. Please ensure the file is not scanned/image-based.")

    # AI Analysis
    ai_data = await analyze_resume_with_ai(text)

    # Calculate ATS score
    skills = ai_data.get("skills", []) or extract_skills_from_text(text)["all"]
    exp_years = ai_data.get("total_experience_years", 0) or estimate_experience_years(text)
    ats = calculate_ats_score(text, skills, exp_years)

    # Build response
    return {
        "success": True,
        "filename": filename,
        "file_type": file_type,
        "personal_info": {
            "name": ai_data.get("name") or "",
            "email": ai_data.get("email") or extract_email(text) or "",
            "phone": ai_data.get("phone") or extract_phone(text) or "",
            "location": ai_data.get("location") or "",
            "linkedin": extract_linkedin(text) or "",
            "github": extract_github(text) or "",
        },
        "skills": ai_data.get("skills", skills),
        "technical_skills": ai_data.get("technical_skills", []),
        "soft_skills": ai_data.get("soft_skills", []),
        "experience": ai_data.get("experience", []),
        "education": ai_data.get("education", []),
        "certifications": ai_data.get("certifications", []),
        "ats_score": ats,
        "suggestions": ai_data.get("suggestions", []),
        "missing_skills": ai_data.get("missing_skills", []),
        "keywords": ai_data.get("keywords", skills[:15]),
        "summary": ai_data.get("summary", ""),
        "total_experience_years": exp_years,
        "word_count": len(text.split()),
        "char_count": len(text)
    }

@router.post("/analyze-text")
async def analyze_text(payload: dict):
    """Analyze resume from raw text"""
    text = payload.get("text", "")
    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Text is too short")

    ai_data = await analyze_resume_with_ai(text)
    skills = ai_data.get("skills", [])
    exp_years = ai_data.get("total_experience_years", 0)
    ats = calculate_ats_score(text, skills, exp_years)

    return {**ai_data, "ats_score": ats}
