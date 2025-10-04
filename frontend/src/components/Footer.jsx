import React from 'react';

export default function Footer() {
    return (
        <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
        </footer>
    );
}