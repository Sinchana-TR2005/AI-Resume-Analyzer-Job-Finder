from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from api.resume_routes import router as resume_router
from api.jobs_routes import router as jobs_router
from api.ai_routes import router as ai_router

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes, calculate ATS scores, and find matching jobs",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "AI Resume Analyzer API", "status": "running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
