import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import AnalyzerPage from './components/AnalyzerPage';
import GlobalStyles from './components/GlobalStyles';

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