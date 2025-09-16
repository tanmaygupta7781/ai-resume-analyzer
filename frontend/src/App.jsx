import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Main App Component ---
export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

    const handleSetToken = (newToken, email) => {
        setToken(newToken);
        setUserEmail(email);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userEmail', email);
    };

    const handleLogout = () => {
        setToken(null);
        setUserEmail(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    };

    return (
        <>
            <Header userEmail={userEmail} onLogout={handleLogout} />
            <main className="main-container">
                {!token ? (
                    <AuthPage onSetToken={handleSetToken} />
                ) : (
                    <AnalyzerPage token={token} />
                )}
            </main>
            <Footer />
            <GlobalStyles />
        </>
    );
}

// --- Authentication Page ---
function AuthPage({ onSetToken }) {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <AuthForm isLogin={isLogin} onSetToken={onSetToken} />
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="toggle-auth-btn"
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
                </button>
            </div>
        </div>
    );
}

// --- Authentication Form ---
function AuthForm({ isLogin, onSetToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Use environment variable for API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

        try {
            const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
            if (isLogin) {
                onSetToken(response.data.token, response.data.email);
            } else {
                alert('Signup successful! Please log in.');
                // Automatically switch to the login form
                window.location.reload(); 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
        </form>
    );
}


// --- Analyzer Page ---
function AnalyzerPage({ token }) {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            setResumeFile(file);
            setError('');
        } else {
            setResumeFile(null);
            setError('Please upload a valid PDF or DOCX file.');
        }
    };

    const handleAnalyze = async () => {
        if (!resumeFile || !jobDescription) {
            setError('Please upload a resume and provide a job description.');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await axios.post(`${API_URL}/api/analyze`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setAnalysisResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="analyzer-container">
            <div className="input-section">
                <h2 className="section-title">Analyze Your Resume</h2>
                <div className="upload-box">
                    <label htmlFor="resume-upload" className="upload-label">
                        {resumeFile ? `Selected: ${resumeFile.name}` : '1. Upload Resume (PDF/DOCX)'}
                    </label>
                    <input id="resume-upload" type="file" onChange={handleFileChange} accept=".pdf,.docx" />
                </div>
                <textarea
                    className="jd-textarea"
                    placeholder="2. Paste Job Description Here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <button onClick={handleAnalyze} disabled={isLoading || !resumeFile || !jobDescription} className="analyze-btn">
                    {isLoading ? 'Analyzing...' : 'Run Analysis'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
            {isLoading && <Loader />}
            {analysisResult && <ResultsDisplay result={analysisResult} />}
        </div>
    );
}

// --- Results Display ---
function ResultsDisplay({ result }) {
    const { aiAnalysis } = result;

    if (!aiAnalysis) return <p>No AI analysis data available.</p>;
    
    const score = aiAnalysis.matchScore;

    const getScoreColor = (s) => {
        if (s > 75) return '#28a745'; // Green
        if (s > 50) return '#ffc107'; // Yellow
        return '#dc3545'; // Red
    };

    const scoreColor = getScoreColor(score);

    return (
        <div className="results-section">
            <h2 className="section-title">Analysis Results</h2>
            <div className="score-container">
                <h3>AI Match Score</h3>
                <div className="score-circle" style={{'--score-color': scoreColor, '--score-value': `${score}%`}}>
                    <span className="score-text">{score}%</span>
                </div>
                <p>This score reflects the AI's assessment of your resume's alignment with the job description.</p>
            </div>

            <div className="details-grid">
                <div className="result-card">
                    <h3><i className="fas fa-cogs"></i> Extracted Skills</h3>
                    <ul>
                        {aiAnalysis.extractedSkills?.map((skill, index) => <li key={index}>{skill}</li>) || <li>No skills extracted.</li>}
                    </ul>
                </div>
                <div className="result-card">
                    <h3><i className="fas fa-lightbulb"></i> Improvement Suggestions</h3>
                    <ul>
                        {aiAnalysis.improvementSuggestions?.map((suggestion, index) => <li key={index}>{suggestion}</li>) || <li>No suggestions available.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// --- UI & Utility Components ---
function Header({ userEmail, onLogout }) {
    return (
        <header className="app-header">
            <div className="logo">
                <i className="fas fa-robot"></i> AI Resume Analyzer
            </div>
            {userEmail && (
                <div className="user-info">
                    <span>{userEmail}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            )}
        </header>
    );
}

function Footer() {
    return (
        <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
        </footer>
    );
}

function Loader() {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Our AI is analyzing your profile... This may take a moment.</p>
        </div>
    );
}

// --- Global Styles ---
// Using a component to inject global styles for this single-file setup
function GlobalStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

            :root {
                --primary-color: #0a7cff;
                --primary-hover: #0056b3;
                --secondary-color: #f8f9fa;
                --background-color: #ffffff;
                --text-color: #333;
                --border-color: #dee2e6;
                --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                --success-color: #28a745;
                --warning-color: #ffc107;
                --error-color: #dc3545;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: 'Roboto', sans-serif;
                background-color: var(--secondary-color);
                color: var(--text-color);
                line-height: 1.6;
            }

            #root {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }

            .main-container {
                flex-grow: 1;
                padding: 2rem;
                max-width: 1200px;
                width: 100%;
                margin: 0 auto;
            }

            /* --- Header & Footer --- */
            .app-header {
                background-color: var(--background-color);
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-color);
            }
            .logo .fas { margin-right: 0.5rem; }

            .user-info { display: flex; align-items: center; gap: 1rem; }

            .logout-btn {
                background: transparent;
                border: 1px solid var(--primary-color);
                color: var(--primary-color);
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .logout-btn:hover { background-color: var(--primary-color); color: white; }

            .app-footer {
                text-align: center;
                padding: 1rem;
                background-color: var(--background-color);
                border-top: 1px solid var(--border-color);
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            /* --- Auth Page --- */
            .auth-container { display: flex; justify-content: center; align-items: center; padding-top: 4rem; }
            .auth-card {
                background: var(--background-color);
                padding: 2.5rem;
                border-radius: 8px;
                box-shadow: var(--card-shadow);
                width: 100%;
                max-width: 400px;
                text-align: center;
            }
            .auth-title { margin-bottom: 1.5rem; color: #333; }
            .auth-form { display: flex; flex-direction: column; gap: 1rem; }
            .form-input {
                padding: 0.8rem;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 1rem;
            }
            .submit-btn {
                padding: 0.8rem;
                border: none;
                border-radius: 5px;
                background-color: var(--primary-color);
                color: white;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .submit-btn:hover { background-color: var(--primary-hover); }
            .submit-btn:disabled { background-color: #a0a0a0; cursor: not-allowed; }
            
            .toggle-auth-btn {
                background: none;
                border: none;
                color: var(--primary-color);
                margin-top: 1rem;
                cursor: pointer;
            }
            .error-message { color: var(--error-color); margin-top: 1rem; font-size: 0.9rem; }

            /* --- Analyzer Page --- */
            .analyzer-container { display: grid; grid-template-columns: 1fr; gap: 2rem; }
            @media (min-width: 992px) {
                .analyzer-container { grid-template-columns: 400px 1fr; }
            }

            .input-section, .results-section {
                background: var(--background-color);
                padding: 2rem;
                border-radius: 8px;
                box-shadow: var(--card-shadow);
            }
            .section-title { margin-bottom: 1.5rem; font-weight: 500; }
            
            .upload-box input[type="file"] { display: none; }
            .upload-label {
                display: block;
                padding: 1rem;
                border: 2px dashed var(--border-color);
                border-radius: 5px;
                text-align: center;
                cursor: pointer;
                transition: border-color 0.2s, background-color 0.2s;
            }
            .upload-label:hover { border-color: var(--primary-color); background-color: #f0f8ff; }

            .jd-textarea {
                width: 100%;
                height: 250px;
                padding: 1rem;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                resize: vertical;
                margin: 1.5rem 0;
                font-family: inherit;
                font-size: 1rem;
            }

            .analyze-btn {
                width: 100%;
                padding: 1rem;
                font-size: 1.1rem;
                font-weight: 700;
                border: none;
                border-radius: 5px;
                background-color: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .analyze-btn:hover:not(:disabled) { background-color: var(--primary-hover); }
            .analyze-btn:disabled { background-color: #a0a0a0; cursor: not-allowed; }

            /* --- Results Display --- */
            .results-section {
                height: fit-content;
            }
            .score-container { text-align: center; margin-bottom: 2rem; }
            .score-container h3 { margin-bottom: 1rem; font-weight: 500; }
            .score-circle {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto 1rem;
                background: conic-gradient(var(--score-color) var(--score-value), #e9ecef 0);
                position: relative;
            }
            .score-circle::before {
                content: '';
                position: absolute;
                width: 130px;
                height: 130px;
                background: white;
                border-radius: 50%;
            }
            .score-text { font-size: 2.5rem; font-weight: 700; z-index: 1; color: var(--score-color); }
            .score-container p { font-size: 0.9rem; color: #6c757d; max-width: 300px; margin: auto; }

            .details-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
            
            .result-card {
                padding: 1.5rem;
                border: 1px solid var(--border-color);
                border-radius: 8px;
            }
            .result-card h3 {
                margin-bottom: 1rem;
                font-weight: 500;
                color: var(--primary-color);
                display: flex;
                align-items: center;
            }
            .result-card h3 .fas { margin-right: 0.5rem; }
            .result-card ul { list-style-position: inside; padding-left: 0; }
            .result-card li { margin-bottom: 0.5rem; }

            /* --- Loader --- */
            .loader-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 2rem;
                text-align: center;
                height: 100%;
                min-height: 400px;
            }
            .loader {
                border: 5px solid #f3f3f3;
                border-top: 5px solid var(--primary-color);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}
        </style>
    );
}

