import os
import httpx
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_API_KEY = os.getenv("ADZUNA_API_KEY", "")

# Curated job database for fallback / demo
DEMO_JOBS = [
    {
        "title": "Senior Software Engineer",
        "company": "TechCorp Inc",
        "location": "San Francisco, CA (Remote)",
        "description": "Build scalable microservices and APIs. Work with React, Node.js, and AWS. Lead engineering initiatives and mentor junior developers.",
        "required_skills": ["JavaScript", "React", "Node.js", "AWS", "Docker", "SQL", "System Design"],
        "salary_range": "$140,000 - $180,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/1"
    },
    {
        "title": "Full Stack Developer",
        "company": "StartupXYZ",
        "location": "New York, NY (Hybrid)",
        "description": "Develop end-to-end web applications using React and Python/FastAPI. Collaborate with product team on feature delivery.",
        "required_skills": ["React", "Python", "FastAPI", "PostgreSQL", "TypeScript", "Git", "REST API"],
        "salary_range": "$110,000 - $145,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/2"
    },
    {
        "title": "Machine Learning Engineer",
        "company": "AI Innovations Ltd",
        "location": "Remote",
        "description": "Build and deploy ML models at scale. Work with large datasets using Python, TensorFlow/PyTorch, and cloud platforms.",
        "required_skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "AWS", "Docker", "SQL", "NLP"],
        "salary_range": "$150,000 - $200,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/3"
    },
    {
        "title": "DevOps Engineer",
        "company": "CloudBase Systems",
        "location": "Austin, TX",
        "description": "Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure. Improve deployment reliability and observability.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Python", "Bash"],
        "salary_range": "$120,000 - $160,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/4"
    },
    {
        "title": "Data Scientist",
        "company": "DataDriven Analytics",
        "location": "Chicago, IL (Remote)",
        "description": "Develop predictive models, run experiments, and deliver business insights using Python and ML frameworks.",
        "required_skills": ["Python", "Machine Learning", "SQL", "Pandas", "NumPy", "Data Analysis", "scikit-learn"],
        "salary_range": "$130,000 - $170,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/5"
    },
    {
        "title": "Frontend Engineer",
        "company": "PixelPerfect Studio",
        "location": "Los Angeles, CA",
        "description": "Craft beautiful, performant React applications. Work closely with designers to implement pixel-perfect UIs.",
        "required_skills": ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Tailwind CSS", "Next.js", "Figma"],
        "salary_range": "$110,000 - $150,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/6"
    },
    {
        "title": "Backend Engineer (Python)",
        "company": "Fintech Solutions",
        "location": "Boston, MA (Hybrid)",
        "description": "Design and build high-throughput APIs and microservices using Python. Work with PostgreSQL and Redis.",
        "required_skills": ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "REST API", "Microservices"],
        "salary_range": "$125,000 - $165,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/7"
    },
    {
        "title": "Cloud Architect",
        "company": "Enterprise Cloud Co",
        "location": "Seattle, WA",
        "description": "Design cloud-native architectures on AWS/Azure. Lead infrastructure modernization and cost optimization projects.",
        "required_skills": ["AWS", "Azure", "Terraform", "Kubernetes", "System Design", "Python", "Microservices"],
        "salary_range": "$170,000 - $220,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/8"
    },
    {
        "title": "iOS Developer",
        "company": "MobileFirst Apps",
        "location": "Remote",
        "description": "Build and maintain high-quality iOS applications using Swift. Collaborate with design and backend teams.",
        "required_skills": ["Swift", "iOS", "Xcode", "REST API", "Git", "Agile", "UI/UX"],
        "salary_range": "$120,000 - $155,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/9"
    },
    {
        "title": "Site Reliability Engineer",
        "company": "ScaleUp Tech",
        "location": "Denver, CO (Remote)",
        "description": "Ensure reliability, performance, and scalability of production systems. Build monitoring and alerting systems.",
        "required_skills": ["Linux", "Python", "Kubernetes", "AWS", "Docker", "Bash", "CI/CD", "Monitoring"],
        "salary_range": "$135,000 - $175,000",
        "job_type": "Full-time",
        "url": "https://example.com/job/10"
    }
]

def calculate_match(user_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
    """Calculate how well user skills match job requirements"""
    user_lower = [s.lower() for s in user_skills]
    job_lower = [s.lower() for s in job_skills]

    matched = [s for s in job_skills if s.lower() in user_lower]
    missing = [s for s in job_skills if s.lower() not in user_lower]

    pct = (len(matched) / len(job_skills) * 100) if job_skills else 0
    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": round(pct, 1)
    }

async def get_job_recommendations(skills: List[str], limit: int = 8) -> List[Dict[str, Any]]:
    """Get job recommendations - tries Adzuna API first, falls back to demo data"""
    if ADZUNA_APP_ID and ADZUNA_API_KEY:
        try:
            return await _fetch_adzuna_jobs(skills, limit)
        except Exception as e:
            logger.warning(f"Adzuna API failed, using demo data: {e}")

    return _get_demo_recommendations(skills, limit)

async def _fetch_adzuna_jobs(skills: List[str], limit: int) -> List[Dict]:
    """Fetch jobs from Adzuna API"""
    query = " ".join(skills[:5])
    url = f"https://api.adzuna.com/v1/api/jobs/us/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_API_KEY,
        "results_per_page": limit,
        "what": query,
        "content-type": "application/json"
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    results = []
    for job in data.get("results", []):
        job_skills = skills[:5]  # Use user skills as approximate match
        match = calculate_match(skills, job_skills)
        results.append({
            "title": job.get("title", ""),
            "company": job.get("company", {}).get("display_name", ""),
            "location": job.get("location", {}).get("display_name", ""),
            "description": job.get("description", "")[:300],
            "required_skills": job_skills,
            "salary_range": f"${job.get('salary_min', 0):,.0f} - ${job.get('salary_max', 0):,.0f}" if job.get('salary_min') else None,
            "url": job.get("redirect_url", ""),
            "job_type": "Full-time",
            **match
        })
    return results

def _get_demo_recommendations(skills: List[str], limit: int) -> List[Dict]:
    """Return matched jobs from demo database"""
    results = []
    for job in DEMO_JOBS:
        match = calculate_match(skills, job["required_skills"])
        results.append({
            **job,
            **match
        })
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results[:limit]
