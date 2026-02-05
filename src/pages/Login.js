import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ClickSpark from '../components/ClickSpark';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    if (username.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    login(username.trim());
    navigate('/setup');
  };

  return (
    <ClickSpark
      sparkColor={theme === 'light' ? '#667eea' : '#a78bfa'}
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div className="login-page">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="login-container fade-in">
        <div className="login-card card">
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🎯</span>
            </div>
            <h1>Quiz Master</h1>
            <p>Test your knowledge with exciting quizzes</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Your Name</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Start Quiz Journey
              <span></span>
            </button>
          </form>

          <div className="login-features">
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>Multiple Categories</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <span>Timed Challenges</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💾</span>
              <span>Auto Save Progress</span>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>Powered by Open Trivia Database</p>
        </div>
      </div>
    </div>
    </ClickSpark>
  );
}

export default Login;
