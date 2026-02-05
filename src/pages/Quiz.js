import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useTheme } from '../context/ThemeContext';
import ClickSpark from '../components/ClickSpark';
import './Quiz.css';

function Quiz() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    setTimeRemaining,
    answerQuestion,
    quizConfig
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/setup');
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, navigate, setTimeRemaining]);

  useEffect(() => {
    // Check if quiz is complete
    if (answers.length === questions.length) {
      navigate('/results');
    }
  }, [answers, questions, navigate]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer) => {
    if (isAnimating) return;
    
    setSelectedAnswer(answer);
    setIsAnimating(true);

    setTimeout(() => {
      answerQuestion(answer);
      setSelectedAnswer('');
      setIsAnimating(false);
    }, 300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / (quizConfig.timeLimit * 60)) * 100;
    if (percentage > 50) return 'var(--success)';
    if (percentage > 20) return 'var(--warning)';
    return 'var(--error)';
  };

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this quiz session? Your progress will be saved.')) {
      navigate('/results');
    }
  };

  return (
    <ClickSpark
      sparkColor={theme === 'light' ? '#667eea' : '#a78bfa'}
      sparkSize={10}
      sparkRadius={18}
      sparkCount={12}
      duration={450}
    >
      <div className="quiz-page">
        <nav className="quiz-navbar">
        <div className="navbar-content">
          <div className="quiz-progress-info">
            <span className="question-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="navbar-actions">
            <div className="timer" style={{ color: getTimerColor() }}>
              <span className="timer-icon">⏱️</span>
              <span className="timer-text">{formatTime(timeRemaining)}</span>
            </div>
            <button className="theme-toggle-small" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="btn btn-danger btn-small" onClick={handleEndSession}>
              End Session
            </button>
          </div>
        </div>
      </nav>

      <div className="quiz-container">
        <div className="quiz-card card fade-in">
          <div className="question-header">
            <span className={`difficulty-badge ${currentQuestion.difficulty}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="category-badge">
              {decodeHTML(currentQuestion.category)}
            </span>
          </div>

          <div className="question-content">
            <h2 className="question-text">
              {decodeHTML(currentQuestion.question)}
            </h2>
          </div>

          <div className="answers-grid">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-btn ${selectedAnswer === answer ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isAnimating}
              >
                <span className="answer-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="answer-text">
                  {decodeHTML(answer)}
                </span>
              </button>
            ))}
          </div>

          <div className="quiz-stats">
            <div className="stat">
              <span className="stat-icon">✅</span>
              <span className="stat-label">Answered</span>
              <span className="stat-value">{answers.length}</span>
            </div>
            <div className="stat">
              <span className="stat-icon">⏳</span>
              <span className="stat-label">Remaining</span>
              <span className="stat-value">{questions.length - answers.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ClickSpark>
  );
}

export default Quiz;
