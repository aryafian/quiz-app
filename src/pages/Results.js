import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ClickSpark from '../components/ClickSpark';
import './Results.css';

function Results() {
  const navigate = useNavigate();
  const { questions, answers, calculateResults, resetQuiz, quizStartTime } = useQuiz();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/setup');
      return;
    }

    const results = calculateResults();
    if (results.percentage >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [questions, navigate, calculateResults]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const results = calculateResults();
  const timeTaken = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', emoji: '🏆', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', emoji: '🌟', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', emoji: '👍', message: 'Great Job!' };
    if (percentage >= 60) return { grade: 'C', emoji: '👌', message: 'Good Effort!' };
    if (percentage >= 50) return { grade: 'D', emoji: '💪', message: 'Keep Trying!' };
    return { grade: 'F', emoji: '📚', message: 'Practice More!' };
  };

  const gradeInfo = getGrade(results.percentage);

  const handleNewQuiz = () => {
    resetQuiz();
    navigate('/setup');
  };

  return (
    <ClickSpark
      sparkColor={theme === 'light' ? '#667eea' : '#a78bfa'}
      sparkSize={14}
      sparkRadius={25}
      sparkCount={15}
      duration={600}
    >
      <div className="results-page">
        {showConfetti && <div className="confetti"></div>}
      
        <nav className="results-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="logo-icon">🎯</span>
            <span>Quiz Master</span>
          </div>
          <button className="theme-toggle-small" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <div className="results-container">
        <div className="results-header fade-in">
          <div className="grade-circle">
            <div className="grade-emoji">{gradeInfo.emoji}</div>
            <div className="grade-text">{gradeInfo.grade}</div>
          </div>
          <h1>Quiz Complete, {user?.username}!</h1>
          <p className="grade-message">{gradeInfo.message}</p>
        </div>

        <div className="results-summary card fade-in">
          <div className="summary-stats">
            <div className="stat-large">
              <div className="stat-circle correct">
                <span className="stat-number">{results.correct}</span>
              </div>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat-large">
              <div className="stat-circle wrong">
                <span className="stat-number">{results.wrong}</span>
              </div>
              <span className="stat-label">Wrong</span>
            </div>
            <div className="stat-large">
              <div className="stat-circle unanswered">
                <span className="stat-number">{results.unanswered}</span>
              </div>
              <span className="stat-label">Unanswered</span>
            </div>
          </div>

          <div className="score-display">
            <div className="score-percentage">
              {results.percentage}%
            </div>
            <div className="score-fraction">
              {results.correct} out of {results.total} questions
            </div>
          </div>

          <div className="time-taken">
            <span className="time-icon">⏱️</span>
            <span>Time Taken: {formatTime(timeTaken)}</span>
          </div>
        </div>

        <div className="detailed-results card fade-in">
          <h2>Detailed Results</h2>
          <div className="questions-review">
            {questions.map((question, index) => {
              const userAnswer = answers.find(a => a.questionIndex === index);
              const isCorrect = userAnswer?.answer === question.correct_answer;
              const wasAnswered = !!userAnswer;

              return (
                <div 
                  key={index} 
                  className={`question-review ${
                    !wasAnswered ? 'unanswered' : isCorrect ? 'correct' : 'wrong'
                  }`}
                >
                  <div className="review-header">
                    <span className="question-number">Question {index + 1}</span>
                    <span className={`result-badge ${
                      !wasAnswered ? 'badge-unanswered' : isCorrect ? 'badge-correct' : 'badge-wrong'
                    }`}>
                      {!wasAnswered ? '⏭️ Skipped' : isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  </div>
                  
                  <div className="review-question">
                    {decodeHTML(question.question)}
                  </div>

                  <div className="review-answers">
                    {wasAnswered && (
                      <div className="answer-row">
                        <span className="answer-label">Your Answer:</span>
                        <span className={`answer-value ${isCorrect ? 'correct' : 'wrong'}`}>
                          {decodeHTML(userAnswer.answer)}
                        </span>
                      </div>
                    )}
                    
                    {(!wasAnswered || !isCorrect) && (
                      <div className="answer-row">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-value correct">
                          {decodeHTML(question.correct_answer)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="results-actions fade-in">
          <button className="btn btn-primary btn-large" onClick={handleNewQuiz}>
            <span>Start New Quiz</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
    </ClickSpark>
  );
}

export default Results;