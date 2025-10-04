import React from 'react';

export default function Header({ userEmail, onLogout }) {
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