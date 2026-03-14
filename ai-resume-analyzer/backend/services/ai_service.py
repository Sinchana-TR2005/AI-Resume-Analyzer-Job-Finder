import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

TECH_SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
    "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "Django", "FastAPI", "Flask", "Spring Boot",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "CI/CD", "Git", "GitHub",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "GraphQL", "REST API", "gRPC",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn", "NLP", "Computer Vision",
    "Data Science", "Data Analysis", "SQL", "Pandas", "NumPy", "Spark", "Hadoop", "Airflow",
    "React Native", "Flutter", "iOS", "Android", "HTML", "CSS", "SASS", "Tailwind CSS",
    "Linux", "Bash", "PowerShell", "Microservices", "System Design", "Agile", "Scrum",
    "Figma", "Adobe XD", "UI/UX", "Product Management", "Project Management", "JIRA"
]

SOFT_SKILLS = [
    "Leadership", "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
    "Time Management", "Adaptability", "Creativity", "Attention to Detail", "Collaboration",
    "Mentoring", "Strategic Planning", "Conflict Resolution", "Presentation", "Negotiation"
]

def extract_skills_from_text(text: str) -> Dict[str, List[str]]:
    """Extract skills using keyword matching as fallback"""
    text_lower = text.lower()
    found_tech = [s for s in TECH_SKILLS if s.lower() in text_lower]
    found_soft = [s for s in SOFT_SKILLS if s.lower() in text_lower]
    return {
        "technical": found_tech,
        "soft": found_soft,
        "all": found_tech + found_soft
    }

async def analyze_resume_with_ai(text: str) -> Dict[str, Any]:
    """Use OpenAI to analyze resume and extract structured data"""
    if not OPENAI_API_KEY or OPENAI_API_KEY == "":
        return await _analyze_resume_fallback(text)

    try:
        import openai
        client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)

        prompt = f"""Analyze this resume and return a JSON object with:
{{
  "name": "full name",
  "email": "email if found",
  "phone": "phone if found",
  "location": "city/country",
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "technical_skills": ["tech1", "tech2", ...],
  "soft_skills": ["soft1", "soft2", ...],
  "experience": [
    {{"title": "job title", "company": "company name", "duration": "dates", "description": "key achievements", "years": 2.5}}
  ],
  "education": [
    {{"degree": "degree name", "institution": "school name", "year": "graduation year", "field": "field of study"}}
  ],
  "certifications": [
    {{"name": "cert name", "issuer": "issuer", "year": "year"}}
  ],
  "keywords": ["important keywords for ATS"],
  "missing_skills": ["skills commonly needed but missing"],
  "suggestions": [
    "Specific actionable improvement suggestion 1",
    "Specific actionable improvement suggestion 2"
  ],
  "total_experience_years": 5.0
}}

Resume text:
{text[:4000]}

Return ONLY valid JSON, no markdown, no explanation."""

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert resume analyzer and HR professional. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        content = response.choices[0].message.content.strip()
        # Strip markdown fences if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)

    except Exception as e:
        logger.error(f"OpenAI analysis failed: {e}")
        return await _analyze_resume_fallback(text)

async def _analyze_resume_fallback(text: str) -> Dict[str, Any]:
    """Fallback analysis without OpenAI"""
    from services.resume_parser import (
        extract_email, extract_phone, extract_linkedin, extract_github,
        extract_name_simple, estimate_experience_years
    )

    skills = extract_skills_from_text(text)
    name = extract_name_simple(text)
    email = extract_email(text)
    phone = extract_phone(text)
    exp_years = estimate_experience_years(text)

    # Build suggestions based on what's found
    suggestions = []
    if len(skills['technical']) < 5:
        suggestions.append("Add more technical skills to improve ATS keyword matching.")
    if not any(c.isdigit() for c in text[:200] if c in '%$'):
        suggestions.append("Quantify your achievements with numbers, percentages, or dollar amounts.")
    if len(text) < 800:
        suggestions.append("Your resume appears short. Add more detail to your experience section.")
    suggestions.append("Use strong action verbs like 'Led', 'Developed', 'Implemented', 'Optimized'.")
    suggestions.append("Add a compelling professional summary at the top of your resume.")
    suggestions.append("Tailor your resume keywords to match specific job descriptions.")

    all_skills = skills['technical'] + skills['soft']
    common_skills = ["Docker", "Kubernetes", "AWS", "CI/CD", "Agile", "System Design"]
    missing = [s for s in common_skills if s not in all_skills][:5]

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "location": None,
        "summary": f"Experienced professional with {exp_years:.0f} years of experience and expertise in {', '.join(skills['technical'][:3]) if skills['technical'] else 'various domains'}.",
        "skills": all_skills,
        "technical_skills": skills['technical'],
        "soft_skills": skills['soft'],
        "experience": [],
        "education": [],
        "certifications": [],
        "keywords": skills['technical'][:15],
        "missing_skills": missing,
        "suggestions": suggestions,
        "total_experience_years": exp_years
    }

async def generate_cover_letter(resume_data: Dict, job_title: str, company: str, job_desc: Optional[str] = None) -> str:
    """Generate a cover letter using OpenAI"""
    if not OPENAI_API_KEY:
        name = resume_data.get('name', 'Candidate')
        skills = ", ".join(resume_data.get('technical_skills', [])[:5])
        return f"""Dear Hiring Manager,

I am excited to apply for the {job_title} position at {company}. With my background in {skills}, I am confident I can make meaningful contributions to your team.

Throughout my career, I have developed strong technical and collaborative skills that align with {company}'s mission. I am passionate about delivering high-quality work and continuously improving my skills.

I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.

Sincerely,
{name}"""

    try:
        import openai
        client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)

        skills_str = ", ".join(resume_data.get('technical_skills', [])[:8])
        exp_years = resume_data.get('total_experience_years', 0)

        prompt = f"""Write a professional, personalized cover letter for:
- Candidate: {resume_data.get('name', 'Candidate')}
- Applying for: {job_title} at {company}
- Key skills: {skills_str}
- Years of experience: {exp_years}
{f'- Job description excerpt: {job_desc[:500]}' if job_desc else ''}

Write 3-4 paragraphs. Be specific, professional, and enthusiastic. Don't use generic templates."""

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=600
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Cover letter generation failed: {e}")
        return "Cover letter generation failed. Please try again."

async def get_career_paths(skills: List[str], exp_years: float, current_role: Optional[str] = None) -> List[Dict]:
    """Generate career path suggestions"""
    if not OPENAI_API_KEY:
        paths = [
            {"role": "Senior Software Engineer", "timeline": "1-2 years", "required_skills": ["System Design", "Leadership", "Mentoring"], "match": 85},
            {"role": "Tech Lead", "timeline": "2-3 years", "required_skills": ["Team Management", "Architecture", "Strategy"], "match": 70},
            {"role": "Engineering Manager", "timeline": "3-5 years", "required_skills": ["People Management", "OKRs", "Budgeting"], "match": 55},
            {"role": "Principal Engineer", "timeline": "3-5 years", "required_skills": ["Architecture", "Cross-team Leadership", "Technical Vision"], "match": 60},
            {"role": "CTO", "timeline": "7-10 years", "required_skills": ["Executive Leadership", "Business Strategy", "Full-stack Org Management"], "match": 35},
        ]
        return paths

    try:
        import openai
        client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)

        prompt = f"""Given a professional with:
- Current skills: {', '.join(skills[:15])}
- Years of experience: {exp_years}
- Current role: {current_role or 'Not specified'}

Return a JSON array of 5 career path options:
[{{"role": "title", "timeline": "X-Y years", "required_skills": ["skill1","skill2"], "match": 85, "description": "brief path description"}}]

Return ONLY JSON array, no markdown."""

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=600
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except Exception as e:
        logger.error(f"Career path generation failed: {e}")
        return []
