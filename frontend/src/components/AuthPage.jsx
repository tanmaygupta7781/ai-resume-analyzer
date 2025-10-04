import React, { useState } from 'react';
import AuthForm from './AuthForm';

export default function AuthPage({ onSetToken }) {
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