import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import ResultsDisplay from './ResultsDisplay';

export default function AnalyzerPage({ token }) {
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
