from fastapi import APIRouter, HTTPException
from typing import Optional, List
from services.ai_service import generate_cover_letter, get_career_paths

router = APIRouter()

@router.post("/cover-letter")
async def create_cover_letter(payload: dict):
    """Generate an AI-powered cover letter"""
    resume_data = payload.get("resume_data", {})
    job_title = payload.get("job_title", "")
    company = payload.get("company", "")
    job_description = payload.get("job_description")

    if not job_title or not company:
        raise HTTPException(status_code=400, detail="job_title and company are required")

    letter = await generate_cover_letter(resume_data, job_title, company, job_description)
    return {"cover_letter": letter}

@router.post("/career-paths")
async def career_paths(payload: dict):
    """Get AI career path suggestions"""
    skills = payload.get("skills", [])
    exp_years = payload.get("experience_years", 0)
    current_role = payload.get("current_role")

    if not skills:
        raise HTTPException(status_code=400, detail="Skills are required")

    paths = await get_career_paths(skills, exp_years, current_role)
    return {"paths": paths}

@router.post("/compare-jd")
async def compare_with_jd(payload: dict):
    """Compare resume with a job description"""
    resume_skills = payload.get("resume_skills", [])
    job_description = payload.get("job_description", "")

    if not job_description:
        raise HTTPException(status_code=400, detail="Job description is required")

    from services.ai_service import extract_skills_from_text
    jd_skills = extract_skills_from_text(job_description)
    jd_all = jd_skills["all"]

    resume_lower = [s.lower() for s in resume_skills]
    matched = [s for s in jd_all if s.lower() in resume_lower]
    missing = [s for s in jd_all if s.lower() not in resume_lower]
    match_pct = (len(matched) / len(jd_all) * 100) if jd_all else 0

    return {
        "match_percentage": round(match_pct, 1),
        "matched_skills": matched,
        "missing_skills": missing,
        "jd_skills": jd_all,
        "recommendation": "Strong match! Your resume aligns well." if match_pct > 70
            else "Good match. Add the missing skills to strengthen your application." if match_pct > 40
            else "Low match. Consider acquiring the missing skills or tailoring your resume."
    }

@router.post("/optimize-keywords")
async def optimize_keywords(payload: dict):
    """Suggest keyword optimizations"""
    current_keywords = payload.get("keywords", [])
    target_role = payload.get("target_role", "Software Engineer")

    role_keywords = {
        "Software Engineer": ["algorithms", "data structures", "system design", "scalability", "microservices", "CI/CD"],
        "Data Scientist": ["statistical modeling", "A/B testing", "feature engineering", "model deployment", "ETL"],
        "Product Manager": ["roadmap", "stakeholder", "KPIs", "OKRs", "user research", "agile", "sprint"],
        "DevOps Engineer": ["infrastructure as code", "SRE", "observability", "incident response", "SLA", "SLO"],
    }

    suggested = role_keywords.get(target_role, role_keywords["Software Engineer"])
    missing_kw = [k for k in suggested if k.lower() not in [c.lower() for c in current_keywords]]

    return {
        "current_keywords": current_keywords,
        "suggested_additions": missing_kw,
        "target_role": target_role,
        "tips": [
            f"Add '{kw}' to align with {target_role} positions" for kw in missing_kw[:5]
        ]
    }
