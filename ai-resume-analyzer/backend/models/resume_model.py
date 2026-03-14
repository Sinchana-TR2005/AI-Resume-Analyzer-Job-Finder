from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class Experience(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    years: Optional[float] = None

class Education(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    gpa: Optional[str] = None
    field: Optional[str] = None

class Certification(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    year: Optional[str] = None

class ATSScore(BaseModel):
    overall: int
    keyword_optimization: int
    skills_match: int
    formatting: int
    experience_relevance: int
    education_score: int
    breakdown: Dict[str, Any] = {}

class ResumeAnalysis(BaseModel):
    personal_info: PersonalInfo
    skills: List[str] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    experience: List[Experience] = []
    education: List[Education] = []
    certifications: List[Certification] = []
    ats_score: ATSScore
    suggestions: List[str] = []
    missing_skills: List[str] = []
    keywords: List[str] = []
    summary: Optional[str] = None
    total_experience_years: float = 0
    raw_text: Optional[str] = None

class JobRecommendation(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    required_skills: List[str] = []
    match_percentage: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    salary_range: Optional[str] = None
    url: Optional[str] = None
    job_type: Optional[str] = None

class CoverLetterRequest(BaseModel):
    resume_analysis: Dict[str, Any]
    job_title: str
    company_name: str
    job_description: Optional[str] = None

class CareerPathRequest(BaseModel):
    current_skills: List[str]
    experience_years: float
    current_role: Optional[str] = None
    target_role: Optional[str] = None
