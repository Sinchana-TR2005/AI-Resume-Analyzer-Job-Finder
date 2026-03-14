import React, { useState, useCallback, useRef } from "react";

// ─── Color Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#0A0B0F",
  surface: "#111318",
  card: "#161B26",
  border: "#1E2535",
  borderHover: "#2D3A52",
  accent: "#4F8EF7",
  accentDim: "#1D3A6E",
  accentGlow: "rgba(79,142,247,0.2)",
  green: "#22C55E",
  greenDim: "#052E16",
  amber: "#F59E0B",
  amberDim: "#451A03",
  red: "#EF4444",
  redDim: "#450A0A",
  purple: "#A855F7",
  purpleDim: "#3B0764",
  cyan: "#06B6D4",
  text: "#F0F4FF",
  textMuted: "#8892A4",
  textDim: "#4A5568",
};

// ─── API Config ───────────────────────────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// ─── Mock Data (used when no backend) ────────────────────────────────────────
const MOCK_ANALYSIS = {
  personal_info: { name: "Alex Johnson", email: "alex.johnson@email.com", phone: "+1 (555) 234-5678", location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson", github: "github.com/alexjohnson" },
  skills: ["React", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "Node.js", "GraphQL", "Kubernetes", "CI/CD", "System Design", "Agile"],
  technical_skills: ["React", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "Node.js", "GraphQL", "Kubernetes", "CI/CD"],
  soft_skills: ["Leadership", "Communication", "Problem Solving", "Teamwork", "Mentoring"],
  experience: [
    { title: "Senior Software Engineer", company: "TechCorp", duration: "2021 - Present", description: "Led microservices migration reducing latency by 40%. Mentored 4 junior engineers.", years: 3 },
    { title: "Software Engineer", company: "StartupXYZ", duration: "2019 - 2021", description: "Built React dashboards serving 100K+ users. Improved CI/CD pipeline reducing deploy time by 60%.", years: 2 },
  ],
  education: [{ degree: "B.S. Computer Science", institution: "UC Berkeley", year: "2019", field: "Computer Science" }],
  certifications: [{ name: "AWS Solutions Architect", issuer: "Amazon", year: "2022" }],
  ats_score: { overall: 82, keyword_optimization: 78, skills_match: 88, formatting: 90, experience_relevance: 85, education_score: 80, breakdown: {} },
  suggestions: [
    "Add quantified metrics to all experience bullet points (e.g., 'improved X by Y%')",
    "Include a concise 2-3 line professional summary at the top",
    "Add more cloud-native keywords: Terraform, Helm, ArgoCD",
    "List specific AWS services used (EC2, Lambda, RDS, S3)",
    "Consider adding open source contributions or side projects",
    "Incorporate more leadership keywords for senior roles"
  ],
  missing_skills: ["Terraform", "Helm", "ArgoCD", "Redis", "Kafka", "gRPC"],
  keywords: ["React", "TypeScript", "Python", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Node.js", "GraphQL", "CI/CD"],
  summary: "Senior Software Engineer with 5+ years building scalable web applications and cloud infrastructure. Expert in React, TypeScript, Python, and AWS. Proven track record of leading technical initiatives and mentoring teams.",
  total_experience_years: 5,
};

const MOCK_JOBS = [
  { title: "Senior Software Engineer", company: "TechCorp Inc", location: "San Francisco, CA (Remote)", description: "Build scalable microservices and APIs. Work with React, Node.js, and AWS.", required_skills: ["React", "Node.js", "AWS", "Docker", "TypeScript"], match_percentage: 90, matched_skills: ["React", "Node.js", "AWS", "Docker", "TypeScript"], missing_skills: [], salary_range: "$140k–$180k", job_type: "Full-time" },
  { title: "Full Stack Developer", company: "StartupXYZ", location: "New York, NY (Hybrid)", description: "Develop end-to-end web applications. Collaborate with product team on feature delivery.", required_skills: ["React", "Python", "PostgreSQL", "Docker", "TypeScript"], match_percentage: 92, matched_skills: ["React", "Python", "PostgreSQL", "Docker", "TypeScript"], missing_skills: [], salary_range: "$110k–$145k", job_type: "Full-time" },
  { title: "Cloud Architect", company: "Enterprise Cloud Co", location: "Seattle, WA", description: "Design cloud-native architectures on AWS/Azure. Lead infrastructure modernization.", required_skills: ["AWS", "Terraform", "Kubernetes", "Docker", "System Design"], match_percentage: 78, matched_skills: ["AWS", "Kubernetes", "Docker", "System Design"], missing_skills: ["Terraform"], salary_range: "$170k–$220k", job_type: "Full-time" },
  { title: "Backend Engineer", company: "Fintech Solutions", location: "Boston, MA", description: "Design and build high-throughput APIs and microservices using Python.", required_skills: ["Python", "PostgreSQL", "Docker", "Redis", "Microservices"], match_percentage: 72, matched_skills: ["Python", "PostgreSQL", "Docker"], missing_skills: ["Redis", "Kafka"], salary_range: "$125k–$165k", job_type: "Full-time" },
  { title: "DevOps Engineer", company: "CloudBase Systems", location: "Austin, TX (Remote)", description: "Manage CI/CD pipelines and Kubernetes clusters.", required_skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"], match_percentage: 80, matched_skills: ["Docker", "Kubernetes", "AWS", "CI/CD"], missing_skills: ["Terraform"], salary_range: "$120k–$160k", job_type: "Full-time" },
  { title: "Frontend Engineer", company: "PixelPerfect Studio", location: "Los Angeles, CA", description: "Craft beautiful, performant React applications with pixel-perfect UIs.", required_skills: ["React", "TypeScript", "CSS", "Next.js", "Figma"], match_percentage: 85, matched_skills: ["React", "TypeScript", "CSS"], missing_skills: ["Next.js", "Figma"], salary_range: "$110k–$150k", job_type: "Full-time" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
const scoreColor = (s) => s >= 80 ? C.green : s >= 60 ? C.amber : C.red;
const matchColor = (m) => m >= 80 ? C.green : m >= 60 ? C.amber : C.red;

const GradientText = ({ children, style = {} }) => (
  <span style={{ background: "linear-gradient(135deg, #4F8EF7 0%, #A855F7 50%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", ...style }}>{children}</span>
);

const Badge = ({ children, color = C.accent, bg, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${color}33`, background: bg || `${color}18`, color, letterSpacing: "0.02em", ...style }}>{children}</span>
);

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.5rem", position: "relative", overflow: "hidden", ...(glow && { boxShadow: `0 0 30px ${C.accentGlow}` }), ...style }}>
    {children}
  </div>
);

const ATSRing = ({ score, size = 140 }) => {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, fontWeight: 600, letterSpacing: "0.08em" }}>ATS SCORE</div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, max = 100, color }) => (
  <div style={{ marginBottom: "0.75rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: C.textMuted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: color || scoreColor(value) }}>{value}%</span>
    </div>
    <div style={{ background: C.border, borderRadius: 8, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", borderRadius: 8, background: color || scoreColor(value), transition: "width 1s ease", boxShadow: `0 0 8px ${color || scoreColor(value)}80` }} />
    </div>
  </div>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ onGetStarted }) => {
  const features = [
    { icon: "🤖", title: "AI-Powered Analysis", desc: "GPT-3.5 extracts skills, experience & education from any resume format" },
    { icon: "📊", title: "ATS Score Calculator", desc: "Real-time scoring based on keyword density, formatting & relevance" },
    { icon: "💼", title: "Job Matching Engine", desc: "Matches your skills to thousands of live job postings with % fit scores" },
    { icon: "✍️", title: "Cover Letter Generator", desc: "AI writes personalized cover letters tailored to specific job roles" },
    { icon: "🗺️", title: "Career Path Planner", desc: "Visualize your next 5 career moves based on current skills" },
    { icon: "🔍", title: "JD Comparison Tool", desc: "Paste any job description and see exactly how your resume compares" },
  ];

  const stats = [
    { num: "50K+", label: "Resumes Analyzed" },
    { num: "94%", label: "ATS Pass Rate" },
    { num: "3.2x", label: "More Interviews" },
    { num: "2 min", label: "Analysis Time" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${C.border}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: `${C.bg}dd`, backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4F8EF7, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>ResumeAI</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onGetStarted} style={{ padding: "8px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer", fontSize: 14 }}>Sign In</button>
          <button onClick={onGetStarted} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4F8EF7, #A855F7)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "5rem 2rem 3rem", maxWidth: 800, margin: "0 auto" }}>
        <Badge color={C.green} style={{ marginBottom: "1.5rem" }}>✨ Powered by GPT-3.5 + NLP</Badge>
        <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
          Land Your Dream Job with<br /><GradientText>AI Resume Intelligence</GradientText>
        </h1>
        <p style={{ fontSize: "1.2rem", color: C.textMuted, marginBottom: "2.5rem", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 2.5rem" }}>
          Upload your resume and get instant AI analysis, ATS scoring, personalized improvement suggestions, and matched job opportunities.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetStarted} style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4F8EF7, #A855F7)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, boxShadow: "0 8px 32px rgba(79,142,247,0.35)", letterSpacing: "-0.01em" }}>
            Analyze My Resume →
          </button>
          <button onClick={onGetStarted} style={{ padding: "14px 32px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", fontSize: 16, fontWeight: 600 }}>
            View Demo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "2rem", flexWrap: "wrap", maxWidth: 800, margin: "0 auto" }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, background: "linear-gradient(135deg, #4F8EF7, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "3rem auto", padding: "0 2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: "2.5rem", letterSpacing: "-0.02em" }}>
          Everything you need to <GradientText>get hired faster</GradientText>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map(f => (
            <Card key={f.title} style={{ cursor: "default" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: `linear-gradient(135deg, ${C.accentDim}30, ${C.purpleDim}30)`, margin: "3rem 0 0", borderTop: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.02em" }}>Ready to supercharge your job search?</h2>
        <p style={{ color: C.textMuted, marginBottom: "2rem", fontSize: 16 }}>Free to use. No sign-up required to try.</p>
        <button onClick={onGetStarted} style={{ padding: "14px 40px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4F8EF7, #A855F7)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, boxShadow: "0 8px 32px rgba(79,142,247,0.35)" }}>
          Upload Your Resume Now →
        </button>
      </div>
    </div>
  );
};

// ─── UPLOAD PAGE ──────────────────────────────────────────────────────────────
const UploadPage = ({ onAnalyzed, onDemo }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ok = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    const ext = f.name.toLowerCase();
    if (!ok.includes(f.type) && !ext.endsWith(".pdf") && !ext.endsWith(".docx")) {
      setError("Only PDF or DOCX files are supported.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) { setError("File must be under 10MB."); return; }
    setFile(f);
    setError("");
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError("");

    // Simulate progress
    const iv = setInterval(() => setProgress(p => Math.min(p + 8, 90)), 200);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE}/resume/upload`, { method: "POST", body: form });
      clearInterval(iv);
      setProgress(100);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || "Upload failed");
      }
      const data = await res.json();
      setTimeout(() => onAnalyzed(data), 400);
    } catch (e) {
      clearInterval(iv);
      setProgress(0);
      if (e.message.includes("fetch") || e.message.includes("Failed")) {
        setError("Backend not running. Click 'Try Demo' to see a sample analysis.");
      } else {
        setError(e.message);
      }
      setLoading(false);
    }
  };

  const steps = ["Extracting text from document", "Running NLP analysis", "Calculating ATS score", "Fetching job matches", "Generating suggestions"];
  const stepIdx = Math.floor(progress / 20);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8 }}>Upload Your Resume</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>PDF or DOCX • Max 10MB • Analyzed in seconds</p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? C.accent : file ? C.green : C.border}`,
            borderRadius: 20,
            padding: "3rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? C.accentGlow : file ? `${C.green}10` : C.surface,
            transition: "all 0.3s ease",
            marginBottom: "1.5rem"
          }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" hidden onChange={(e) => handleFile(e.target.files[0])} />
          {file ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{file.name}</div>
              <div style={{ color: C.textMuted, fontSize: 13 }}>{(file.size / 1024).toFixed(1)} KB • Ready to analyze</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>☁️</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Drag & drop your resume here</div>
              <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 16 }}>or click to browse files</div>
              <Badge color={C.accent}>PDF · DOCX · DOC</Badge>
            </>
          )}
        </div>

        {/* Progress */}
        {loading && (
          <Card style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Analyzing resume...</span>
              <span style={{ fontSize: 14, color: C.accent }}>{progress}%</span>
            </div>
            <div style={{ background: C.border, borderRadius: 8, height: 6, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #4F8EF7, #A855F7)", borderRadius: 8, transition: "width 0.3s ease" }} />
            </div>
            {stepIdx < steps.length && (
              <div style={{ fontSize: 13, color: C.textMuted }}>⚙️ {steps[stepIdx]}</div>
            )}
          </Card>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: `${C.red}18`, border: `1px solid ${C.red}40`, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem", color: C.red, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: !file || loading ? C.border : "linear-gradient(135deg, #4F8EF7, #A855F7)", color: !file || loading ? C.textDim : "#fff", cursor: !file || loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, transition: "all 0.2s" }}
          >
            {loading ? "Analyzing..." : "Analyze Resume →"}
          </button>
          <button
            onClick={onDemo}
            style={{ padding: "14px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}
          >
            Try Demo
          </button>
        </div>
        <p style={{ textAlign: "center", color: C.textDim, fontSize: 12, marginTop: "1rem" }}>
          🔒 Your resume is processed securely and never stored without consent
        </p>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ────────────────────────────────────────────────────────────
const DashboardPage = ({ analysis, jobs, onFindJobs, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [coverLetter, setCoverLetter] = useState("");
  const [clLoading, setCLLoading] = useState(false);
  const [jdText, setJdText] = useState("");
  const [jdResult, setJdResult] = useState(null);
  const [careerPaths, setCareerPaths] = useState(null);
  const [cpLoading, setCpLoading] = useState(false);

  const { personal_info: pi, skills, technical_skills, soft_skills, experience, education, certifications, ats_score, suggestions, missing_skills, keywords, summary, total_experience_years } = analysis;

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "skills", label: "⚡ Skills" },
    { id: "experience", label: "💼 Experience" },
    { id: "suggestions", label: "🎯 Improve" },
    { id: "coverletter", label: "✍️ Cover Letter" },
    { id: "career", label: "🗺️ Career Path" },
    { id: "jdcompare", label: "🔍 JD Compare" },
  ];

  const generateCoverLetter = async () => {
    setCLLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/cover-letter`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_data: analysis, job_title: "Software Engineer", company: "Target Company" })
      });
      const data = await res.json();
      setCoverLetter(data.cover_letter);
    } catch {
      setCoverLetter(`Dear Hiring Manager,\n\nI am excited to apply for a Software Engineer position. With ${total_experience_years} years of experience in ${(technical_skills || []).slice(0, 3).join(", ")}, I am confident I can add significant value to your team.\n\nMy background includes ${summary}\n\nI would welcome the opportunity to discuss how my skills align with your needs.\n\nSincerely,\n${pi?.name || "Applicant"}`);
    }
    setCLLoading(false);
  };

  const compareJD = async () => {
    if (!jdText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/ai/compare-jd`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_skills: skills, job_description: jdText })
      });
      const data = await res.json();
      setJdResult(data);
    } catch {
      // Fallback: simple keyword match
      const jdLower = jdText.toLowerCase();
      const matched = (skills || []).filter(s => jdLower.includes(s.toLowerCase()));
      setJdResult({ match_percentage: Math.round(matched.length / Math.max(skills?.length || 1, 1) * 100), matched_skills: matched, missing_skills: (missing_skills || []).slice(0, 4), recommendation: matched.length > 3 ? "Good match! Tailor your resume for this role." : "Consider highlighting more relevant skills." });
    }
  };

  const fetchCareerPaths = async () => {
    setCpLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/career-paths`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skills || [], experience_years: total_experience_years })
      });
      const data = await res.json();
      setCareerPaths(data.paths);
    } catch {
      setCareerPaths([
        { role: "Senior Engineer → Tech Lead", timeline: "1-2 years", required_skills: ["System Design", "Leadership"], match: 85, description: "Natural progression from current role" },
        { role: "Engineering Manager", timeline: "2-4 years", required_skills: ["People Management", "Strategy"], match: 65, description: "Move into management track" },
        { role: "Principal Engineer", timeline: "3-5 years", required_skills: ["Architecture", "Cross-team leadership"], match: 70, description: "Deep technical individual contributor" },
        { role: "Staff Engineer", timeline: "2-3 years", required_skills: ["Technical Vision", "Influence"], match: 78, description: "Drive technical direction across teams" },
        { role: "CTO / VP Engineering", timeline: "7-12 years", required_skills: ["Executive Leadership", "Business Strategy"], match: 40, description: "C-suite technical leadership" },
      ]);
    }
    setCpLoading(false);
  };

  const scoreItems = [
    { label: "Keyword Optimization", value: ats_score.keyword_optimization },
    { label: "Skills Match", value: ats_score.skills_match },
    { label: "Formatting", value: ats_score.formatting },
    { label: "Experience Relevance", value: ats_score.experience_relevance },
    { label: "Education Score", value: ats_score.education_score },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Bar */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #4F8EF7, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>ResumeAI</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge color={scoreColor(ats_score.overall)}>{ats_score.overall} ATS Score</Badge>
          <Badge color={C.accent}>{pi?.name || "Candidate"}</Badge>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", overflowX: "auto", paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "8px 16px", borderRadius: 10, border: `1px solid ${activeTab === t.id ? C.accent : C.border}`,
              background: activeTab === t.id ? `${C.accent}20` : "transparent",
              color: activeTab === t.id ? C.accent : C.textMuted,
              cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 20 }}>
              {/* Profile Card */}
              <Card glow>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #4F8EF7, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                    {pi?.name?.[0] || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em" }}>{pi?.name || "—"}</div>
                    <div style={{ color: C.textMuted, fontSize: 13 }}>{pi?.email || ""}</div>
                  </div>
                </div>
                {[
                  { icon: "📞", val: pi?.phone },
                  { icon: "📍", val: pi?.location },
                  { icon: "💼", val: pi?.linkedin },
                  { icon: "🐙", val: pi?.github },
                ].filter(i => i.val).map(i => (
                  <div key={i.val} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{i.icon}</span>
                    <span style={{ fontSize: 13, color: C.textMuted }}>{i.val}</span>
                  </div>
                ))}
                {summary && <p style={{ marginTop: 14, fontSize: 13, color: C.textMuted, lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>{summary}</p>}
              </Card>

              {/* ATS Score Card */}
              <Card>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>ATS Score Breakdown</div>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                  <ATSRing score={ats_score.overall} size={120} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>
                      {ats_score.overall >= 80 ? "✅ Excellent — Ready to apply" : ats_score.overall >= 60 ? "⚠️ Good — A few improvements needed" : "❌ Needs work — Follow suggestions"}
                    </div>
                    <Badge color={scoreColor(ats_score.overall)} style={{ fontSize: 13 }}>
                      {ats_score.overall >= 80 ? "High Chance" : ats_score.overall >= 60 ? "Medium Chance" : "Low Chance"} of ATS Pass
                    </Badge>
                  </div>
                </div>
                {scoreItems.map(i => <ProgressBar key={i.label} label={i.label} value={i.value} />)}
              </Card>
            </div>

            {/* Summary Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Total Skills", val: (skills || []).length, color: C.accent, icon: "⚡" },
                { label: "Experience", val: `${total_experience_years}y`, color: C.purple, icon: "💼" },
                { label: "Certifications", val: (certifications || []).length, color: C.green, icon: "🏆" },
                { label: "Missing Skills", val: (missing_skills || []).length, color: C.amber, icon: "🎯" },
              ].map(s => (
                <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.2rem", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Keywords */}
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Detected Keywords</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(keywords || skills || []).slice(0, 20).map(k => (
                  <Badge key={k} color={C.cyan}>{k}</Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>⚡ Technical Skills ({(technical_skills || []).length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(technical_skills || skills || []).map(s => <Badge key={s} color={C.accent}>{s}</Badge>)}
              </div>
            </Card>
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>🤝 Soft Skills ({(soft_skills || []).length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(soft_skills || []).map(s => <Badge key={s} color={C.purple}>{s}</Badge>)}
              </div>
            </Card>
            <Card style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>⚠️ Missing Skills — Add These to Boost Your Score</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(missing_skills || []).map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: `${C.amber}18`, border: `1px solid ${C.amber}33`, borderRadius: 20 }}>
                    <span style={{ color: C.amber, fontSize: 13 }}>+</span>
                    <span style={{ color: C.amber, fontSize: 13, fontWeight: 600 }}>{s}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(experience || []).length > 0 ? (experience || []).map((e, i) => (
              <Card key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>{e.title}</div>
                    <div style={{ color: C.accent, fontWeight: 600, fontSize: 14 }}>{e.company}</div>
                  </div>
                  <Badge color={C.purple}>{e.duration}</Badge>
                </div>
                {e.description && <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{e.description}</p>}
              </Card>
            )) : (
              <Card>
                <p style={{ color: C.textMuted, textAlign: "center" }}>No experience detected. Try uploading a more detailed resume.</p>
              </Card>
            )}
            {(education || []).length > 0 && (
              <>
                <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>🎓 Education</div>
                {education.map((e, i) => (
                  <Card key={i}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{e.degree}</div>
                    <div style={{ color: C.accent, fontSize: 14 }}>{e.institution}</div>
                    {e.year && <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>{e.year}{e.field ? ` • ${e.field}` : ""}</div>}
                  </Card>
                ))}
              </>
            )}
            {(certifications || []).length > 0 && (
              <>
                <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>🏆 Certifications</div>
                {certifications.map((c, i) => (
                  <Card key={i}>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ color: C.textMuted, fontSize: 13 }}>{c.issuer}{c.year ? ` • ${c.year}` : ""}</div>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}

        {/* SUGGESTIONS TAB */}
        {activeTab === "suggestions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card style={{ background: `${C.accentDim}60`, border: `1px solid ${C.accent}40` }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: C.accent }}>🎯 How to improve your ATS score from {ats_score.overall} to 90+</div>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Follow these specific recommendations to significantly boost your resume's performance with Applicant Tracking Systems and recruiters.</p>
            </Card>
            {(suggestions || []).map((s, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem 1.25rem", display: "flex", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.accent, flexShrink: 0 }}>{i + 1}</div>
                <p style={{ margin: 0, fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{s}</p>
              </div>
            ))}
            <button onClick={onFindJobs} style={{ padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 700, marginTop: 8 }}>
              Find Matching Jobs →
            </button>
          </div>
        )}

        {/* COVER LETTER TAB */}
        {activeTab === "coverletter" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>✍️ AI Cover Letter Generator</div>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>Generate a personalized cover letter based on your resume. You can customize the job title and company name.</p>
              {!coverLetter ? (
                <button onClick={generateCoverLetter} disabled={clLoading} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4F8EF7, #A855F7)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                  {clLoading ? "Generating..." : "✨ Generate Cover Letter"}
                </button>
              ) : (
                <>
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.5rem", whiteSpace: "pre-line", fontSize: 14, color: C.textMuted, lineHeight: 1.8, marginBottom: 16 }}>
                    {coverLetter}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => navigator.clipboard.writeText(coverLetter)} style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📋 Copy</button>
                    <button onClick={() => { setCoverLetter(""); generateCoverLetter(); }} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: `${C.accent}20`, color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🔄 Regenerate</button>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* CAREER PATH TAB */}
        {activeTab === "career" && (
          <div>
            {!careerPaths ? (
              <Card style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Discover Your Career Path</div>
                <p style={{ color: C.textMuted, marginBottom: 20, fontSize: 14 }}>Get personalized career trajectory suggestions based on your current skills and experience level.</p>
                <button onClick={fetchCareerPaths} disabled={cpLoading} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4F8EF7, #A855F7)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                  {cpLoading ? "Mapping your path..." : "🚀 Generate Career Paths"}
                </button>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Your Possible Career Paths</div>
                {careerPaths.map((p, i) => (
                  <Card key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>{p.role}</div>
                        <div style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>⏱ {p.timeline}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 20, color: matchColor(p.match) }}>{p.match}%</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>readiness</div>
                      </div>
                    </div>
                    {p.description && <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 10 }}>{p.description}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(p.required_skills || []).map(s => <Badge key={s} color={C.purple} style={{ fontSize: 11 }}>{s}</Badge>)}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ background: C.border, borderRadius: 6, height: 5 }}>
                        <div style={{ width: `${p.match}%`, height: "100%", borderRadius: 6, background: matchColor(p.match) }} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* JD COMPARE TAB */}
        {activeTab === "jdcompare" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>🔍 Resume vs Job Description</div>
              <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 14 }}>Paste a job description to see exactly how well your resume matches and what skills you're missing.</p>
              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                style={{ width: "100%", minHeight: 160, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px", color: C.text, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
              <button onClick={compareJD} disabled={!jdText.trim()} style={{ marginTop: 12, padding: "12px 24px", borderRadius: 10, border: "none", background: !jdText.trim() ? C.border : "linear-gradient(135deg, #4F8EF7, #A855F7)", color: !jdText.trim() ? C.textDim : "#fff", cursor: !jdText.trim() ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700 }}>
                Compare Now →
              </button>
            </Card>
            {jdResult && (
              <Card>
                <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
                  <ATSRing score={jdResult.match_percentage} size={100} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Match Analysis</div>
                    <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>{jdResult.recommendation}</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: C.green, fontSize: 14 }}>✅ Matched Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{(jdResult.matched_skills || []).map(s => <Badge key={s} color={C.green} style={{ fontSize: 11 }}>{s}</Badge>)}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: C.red, fontSize: 14 }}>❌ Missing Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{(jdResult.missing_skills || []).map(s => <Badge key={s} color={C.red} style={{ fontSize: 11 }}>{s}</Badge>)}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── JOBS PAGE ─────────────────────────────────────────────────────────────────
const JobsPage = ({ jobs, skills, onBack }) => {
  const [filter, setFilter] = useState(0);
  const filtered = filter === 0 ? jobs : jobs.filter(j => j.match_percentage >= filter);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}>← Dashboard</button>
          <span style={{ fontWeight: 700 }}>💼 Job Recommendations</span>
        </div>
        <Badge color={C.green}>{jobs.length} matches found</Badge>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[0, 70, 80, 90].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${filter === f ? C.accent : C.border}`, background: filter === f ? `${C.accent}20` : "transparent", color: filter === f ? C.accent : C.textMuted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {f === 0 ? "All Jobs" : `${f}%+ Match`}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((job, i) => (
            <Card key={i} style={{ transition: "border-color 0.2s", cursor: "default" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em" }}>{job.title}</div>
                    {i === 0 && <Badge color={C.green} style={{ fontSize: 11 }}>🔥 Best Match</Badge>}
                  </div>
                  <div style={{ color: C.accent, fontWeight: 600, fontSize: 14 }}>{job.company}</div>
                  <div style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>📍 {job.location} {job.job_type && `• ${job.job_type}`}</div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: matchColor(job.match_percentage), lineHeight: 1 }}>{Math.round(job.match_percentage)}%</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>match</div>
                </div>
              </div>

              <div style={{ background: C.border, borderRadius: 6, height: 5, marginBottom: 14 }}>
                <div style={{ width: `${job.match_percentage}%`, height: "100%", borderRadius: 6, background: matchColor(job.match_percentage), transition: "width 0.8s ease" }} />
              </div>

              {job.description && <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>{job.description}</p>}

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Matched Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {(job.matched_skills || []).slice(0, 6).map(s => <Badge key={s} color={C.green} style={{ fontSize: 11 }}>{s}</Badge>)}
                  </div>
                </div>
                {(job.missing_skills || []).length > 0 && (
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>To Acquire</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {(job.missing_skills || []).slice(0, 4).map(s => <Badge key={s} color={C.amber} style={{ fontSize: 11 }}>{s}</Badge>)}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                {job.salary_range && <Badge color={C.green} style={{ fontSize: 13 }}>💰 {job.salary_range}</Badge>}
                <button style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4F8EF7, #A855F7)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  Apply Now →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);

  const loadJobs = async (skills) => {
    try {
      const res = await fetch(`${API_BASE}/jobs/recommend`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, limit: 8 })
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs(MOCK_JOBS);
    }
  };

  const handleAnalyzed = async (data) => {
    setAnalysis(data);
    await loadJobs(data.skills || []);
    setPage("dashboard");
  };

  const handleDemo = async () => {
    setAnalysis(MOCK_ANALYSIS);
    setJobs(MOCK_JOBS);
    setPage("dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${C.bg}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        textarea:focus, input:focus { border-color: ${C.accent} !important; }
      `}</style>

      {page === "landing" && <LandingPage onGetStarted={() => setPage("upload")} />}
      {page === "upload" && <UploadPage onAnalyzed={handleAnalyzed} onDemo={handleDemo} />}
      {page === "dashboard" && analysis && (
        <DashboardPage
          analysis={analysis}
          jobs={jobs}
          onFindJobs={() => setPage("jobs")}
          onBack={() => setPage("upload")}
        />
      )}
      {page === "jobs" && (
        <JobsPage
          jobs={jobs}
          skills={analysis?.skills || []}
          onBack={() => setPage("dashboard")}
        />
      )}
    </>
  );
}
