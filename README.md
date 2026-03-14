🚀 AI Resume Analyzer & Job Finder

An intelligent AI-powered web application that analyzes resumes, evaluates ATS compatibility, extracts key skills, and recommends relevant job opportunities based on the candidate’s profile.

This project leverages Natural Language Processing (NLP) and modern web technologies to assist job seekers in improving their resumes and identifying suitable career opportunities.

📌 Project Overview

The AI Resume Analyzer & Job Finder is designed to help job seekers understand how well their resumes perform against modern Applicant Tracking Systems (ATS).

The system allows users to upload their resumes and automatically performs:

Resume parsing and skill extraction

ATS score evaluation

AI-powered resume improvement suggestions

Job recommendations based on extracted skills

Resume optimization guidance

This tool simplifies the job search process while helping candidates enhance their resumes using AI-driven insights.

✨ Key Features
📄 Resume Upload & Parsing

Users can upload resumes in PDF or DOCX format. The system extracts important information such as:

Candidate name

Skills

Education

Work experience

Certifications

🤖 AI Resume Analysis

Using advanced AI and NLP techniques, the system analyzes the resume and provides:

ATS compatibility score

Resume quality evaluation

Keyword optimization suggestions

Skill relevance analysis

💡 Resume Improvement Suggestions

The platform generates intelligent suggestions to improve resume quality including:

Missing keywords

Skills improvement recommendations

Formatting enhancements

Better resume summaries

💼 Job Recommendation System

Based on extracted skills and experience, the system recommends relevant jobs and displays:

Job title

Required skills

Job description

Match percentage

Live job listings can be integrated through APIs.

📊 Interactive Dashboard

The application provides a visual dashboard displaying:

ATS score

Extracted skills

Skill gaps

Job recommendations

🛠️ Technology Stack
Frontend

React.js

Tailwind CSS

Modern responsive UI

Backend

Python

FastAPI

REST API architecture

AI & NLP

OpenAI API

spaCy NLP library

Resume Parsing

PyMuPDF

pdfplumber

Database

Firebase / MongoDB (optional)

Deployment

Vercel (Frontend)

Render (Backend)

📂 Project Structure
ai-resume-analyzer
│
├── backend
│   ├── main.py
│   ├── requirements.txt
│   ├── api
│   ├── models
│   └── services
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── README.md

⚙️ Installation & Setup

Follow the steps below to run the project locally.

Prerequisites

Make sure the following tools are installed:

Python 3.10+

Node.js 18+

Git (optional)

Step 1 — Clone the Repository
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer

Step 2 — Run the Backend

Navigate to the backend folder:

cd backend


Create a virtual environment:

python -m venv venv


Activate the virtual environment:

Mac/Linux

source venv/bin/activate


Windows

venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Create environment file:

cp .env.example .env


Start the backend server:

python main.py


If successful, you should see:

Uvicorn running on http://0.0.0.0:8000


Visit:

http://localhost:8000


Expected output:

{"message":"AI Resume Analyzer API","status":"running"}

Step 3 — Run the Frontend

Open another terminal and navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Create environment file:

cp .env.example .env


Start the frontend application:

npm start


The application will open automatically in your browser:

http://localhost:3000

🔑 API Keys (Optional)

Open:

backend/.env


Add your API keys:

OPENAI_API_KEY=your-openai-key
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_API_KEY=your-adzuna-api-key

Without API Keys

The application still works using:

Smart fallback resume analysis

Built-in demo job database

📊 API Documentation

FastAPI automatically generates interactive API documentation.

Swagger UI:

http://localhost:8000/docs


Health Check Endpoint:

http://localhost:8000/health

🧪 Troubleshooting
PyMuPDF Installation Issue
pip install --upgrade pip
pip install PyMuPDF --no-cache-dir

npm Install Errors
npm install --legacy-peer-deps

Port 8000 Already in Use

Mac/Linux

kill -9 $(lsof -ti:8000)


Windows

netstat -ano | findstr :8000
taskkill /PID <PID> /F

🎯 Future Improvements

Potential enhancements include:

Resume vs Job Description matching

AI-powered interview question generator

LinkedIn profile analysis

Career roadmap recommendations

AI-generated cover letters

👩‍💻 Author

Sinchana TR

GitHub: https://github.com/Sinchana-TR2005

LinkedIn: https://www.linkedin.com/in/sinchana-tr-383029297/
