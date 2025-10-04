import React from 'react';

export default function GlobalStyles() {
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