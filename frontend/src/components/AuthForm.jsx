import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ isLogin, onSetToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
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