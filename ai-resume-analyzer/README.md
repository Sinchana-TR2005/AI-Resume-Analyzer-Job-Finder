# ⚡ ResumeAI — AI Resume Analyzer & Job Finder

> A hackathon-ready, production-grade AI web application for resume analysis, ATS scoring, and intelligent job matching.

![ResumeAI](https://img.shields.io/badge/AI%20Powered-GPT--3.5-blue) ![Python](https://img.shields.io/badge/Backend-FastAPI-green) ![React](https://img.shields.io/badge/Frontend-React-cyan)

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📄 Resume Upload | Drag & drop PDF/DOCX upload |
| 🤖 AI Analysis | GPT-3.5 powered skill & info extraction |
| 📊 ATS Score | Multi-factor ATS scoring engine |
| 💼 Job Matching | Real-time job recommendations with % match |
| ✍️ Cover Letter | AI-generated personalized cover letters |
| 🗺️ Career Paths | AI career trajectory planning |
| 🔍 JD Comparison | Resume vs Job Description analysis |
| 🎯 Suggestions | Actionable resume improvement tips |

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── frontend/                  # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx            # Main application (all pages)
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── backend/                   # FastAPI application
│   ├── main.py                # App entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── api/
│   │   ├── resume_routes.py   # /api/resume endpoints
│   │   ├── jobs_routes.py     # /api/jobs endpoints
│   │   └── ai_routes.py       # /api/ai endpoints
│   ├── models/
│   │   └── resume_model.py    # Pydantic data models
│   └── services/
│       ├── resume_parser.py   # PDF/DOCX parsing
│       ├── ai_service.py      # OpenAI integration
│       └── job_service.py     # Job matching engine
│
└── README.md
```

---

## ⚡ Quick Start

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run server
python main.py
# Server runs at http://localhost:8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
# App runs at http://localhost:3000
```

---

## 🔑 API Keys Required

| Service | Purpose | Get Free Key |
|---|---|---|
| OpenAI | Resume analysis, cover letters | [platform.openai.com](https://platform.openai.com) |
| Adzuna | Live job listings | [developer.adzuna.com](https://developer.adzuna.com) |

> **Note:** The app works without API keys using intelligent fallback analysis and a curated demo job database.

---

## 🌐 API Documentation

### `POST /api/resume/upload`
Upload a resume file for analysis.

**Request:** `multipart/form-data` with `file` field (PDF or DOCX)

**Response:**
```json
{
  "personal_info": { "name": "...", "email": "...", "phone": "...", "location": "..." },
  "skills": ["React", "Python", ...],
  "technical_skills": [...],
  "soft_skills": [...],
  "experience": [{ "title": "...", "company": "...", "duration": "...", "description": "..." }],
  "education": [...],
  "certifications": [...],
  "ats_score": {
    "overall": 82,
    "keyword_optimization": 78,
    "skills_match": 88,
    "formatting": 90,
    "experience_relevance": 85,
    "education_score": 80
  },
  "suggestions": [...],
  "missing_skills": [...],
  "keywords": [...],
  "summary": "..."
}
```

### `POST /api/jobs/recommend`
Get job recommendations based on skills.

**Request:**
```json
{ "skills": ["React", "Python", "AWS"], "limit": 8 }
```

### `POST /api/ai/cover-letter`
Generate a personalized cover letter.

**Request:**
```json
{
  "resume_data": {...},
  "job_title": "Software Engineer",
  "company": "TechCorp",
  "job_description": "Optional JD text..."
}
```

### `POST /api/ai/career-paths`
Get AI career path suggestions.

### `POST /api/ai/compare-jd`
Compare resume skills against a job description.

### `POST /api/ai/optimize-keywords`
Get keyword optimization suggestions for a target role.

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Connect GitHub repo to Vercel
# Set REACT_APP_API_URL to your Render backend URL
```

### Backend → Render

1. Push code to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (OPENAI_API_KEY, ADZUNA_APP_ID, ADZUNA_API_KEY)

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router, React Dropzone, Recharts, Lucide React

**Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic v2

**AI/NLP:** OpenAI GPT-3.5, PyMuPDF (PDF parsing), python-docx

**Jobs API:** Adzuna API (with intelligent fallback)

**Deployment:** Vercel (frontend) + Render (backend)

---

## 🏆 Bonus Features Implemented

- ✅ Resume vs Job Description comparison
- ✅ Career path suggestions
- ✅ Resume keyword optimizer
- ✅ AI cover letter generator
- ✅ ATS score visualization
- ✅ Multi-format resume support (PDF + DOCX)
- ✅ Graceful fallback (works without API keys)

---

## 📜 License

MIT License — Built for hackathons and learning. Use freely.
