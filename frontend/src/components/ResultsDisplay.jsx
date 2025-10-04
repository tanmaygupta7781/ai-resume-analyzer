import React from 'react';

export default function ResultsDisplay({ result }) {
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