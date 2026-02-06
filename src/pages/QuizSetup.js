import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useQuiz } from '../context/QuizContext';
import ClickSpark from '../components/ClickSpark';
import './QuizSetup.css';

function QuizSetup() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startQuiz, questions, resetQuiz } = useQuiz();

  const [config, setConfig] = useState({
    amount: 10,
    category: '',
    difficulty: '',
    type: '',
    timeLimit: 10
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
    }
  };

  useEffect(() => {
    // Fetch categories from Open Trivia DB
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => setCategories(data.trivia_categories))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build API URL
      let url = `https://opentdb.com/api.php?amount=${config.amount}`;
      if (config.category) url += `&category=${config.category}`;
      if (config.difficulty) url += `&difficulty=${config.difficulty}`;
      if (config.type) url += `&type=${config.type}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.response_code === 0) {
        // Shuffle answers for each question
        const quizQuestions = data.results.map(q => ({
          ...q,
          answers: shuffleArray([...q.incorrect_answers, q.correct_answer])
        }));

        startQuiz(config, quizQuestions);
        navigate('/quiz');
      } else {
        setError('Could not fetch questions. Please try different settings.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleMenuItemClick = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
      if (callback) callback();
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.hamburger-menu') && !event.target.closest('.mobile-dropdown')) {
        setIsClosing(true);
        setTimeout(() => {
          setIsMenuOpen(false);
          setIsClosing(false);
        }, 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleResume = () => {
    navigate('/quiz');
  };

  const handleNewQuiz = () => {
    if (window.confirm('Are you sure you want to start a new quiz? Current progress will be lost.')) {
      resetQuiz();
    }
  };

  return (
    <ClickSpark
      sparkColor={theme === 'light' ? '#667eea' : '#a78bfa'}
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div className="quiz-setup-page">
        <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="logo-icon">🎯</span>
            <span>Quiz Master</span>
          </div>
          <div className="navbar-actions">
            <span className="user-name desktop-only">
              <img 
                src="/assets/user.png" 
                alt="User"
                className={theme === 'dark' ? 'icon-light' : ''}
                style={{ width: '20px', height: '20px', marginRight: '8px' }}
              />
              {user?.username}
            </span>
            <button className="theme-toggle-small desktop-only" onClick={toggleTheme}>
              <img 
                src={theme === 'light' ? '/assets/moon.png' : '/assets/sun.png'} 
                alt={theme === 'light' ? 'Dark mode' : 'Light mode'}
                className={theme === 'dark' ? 'icon-light' : ''}
                style={{ width: '20px', height: '20px' }}
              />
            </button>
            <button className="btn btn-secondary btn-small desktop-only" onClick={logout}>
              Logout
            </button>
          </div>
          <button 
            className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
        {isMenuOpen && (
          <div className={`mobile-dropdown ${isClosing ? 'closing' : 'open'}`}>
            <div className="mobile-menu-item">
              <img 
                src="/assets/user.png" 
                alt="User"
                className={theme === 'dark' ? 'icon-light' : ''}
                style={{ width: '20px', height: '20px' }}
              />
              <span className="mobile-user-name">{user?.username}</span>
            </div>
            <div className="mobile-menu-item" onClick={toggleTheme}>
              <img 
                src={theme === 'light' ? '/assets/moon.png' : '/assets/sun.png'} 
                alt={theme === 'light' ? 'Dark mode' : 'Light mode'}
                className={theme === 'dark' ? 'icon-light' : ''}
                style={{ width: '20px', height: '20px' }}
              />
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className="mobile-menu-item" onClick={() => handleMenuItemClick(logout)}>
              <span></span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </nav>

      <div className="container">
        {questions.length > 0 && (
          <div className="resume-quiz-banner card fade-in">
            <div className="resume-info">
              <span className="resume-icon">📝</span>
              <div>
                <h3>Resume Previous Quiz</h3>
                <p>You have an unfinished quiz in progress</p>
              </div>
            </div>
            <div className="resume-actions">
              <button className="btn btn-primary" onClick={handleResume}>
                Resume Quiz
              </button>
              <button className="btn btn-secondary" onClick={handleNewQuiz}>
                Start New
              </button>
            </div>
          </div>
        )}

        <div className="setup-content">
          <div className="setup-header fade-in">
            <h1>Configure Your Quiz</h1>
            <p>Customize your quiz experience by selecting your preferences</p>
          </div>

          <div className="setup-card card fade-in">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="amount">
                    <span className="label-icon">🔢</span>
                    Number of Questions
                  </label>
                  <select
                    id="amount"
                    value={config.amount}
                    onChange={(e) => setConfig({...config, amount: e.target.value})}
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                    <option value="25">25 Questions</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="timeLimit">
                    <span className="label-icon">⏱️</span>
                    Time Limit (minutes)
                  </label>
                  <select
                    id="timeLimit"
                    value={config.timeLimit}
                    onChange={(e) => setConfig({...config, timeLimit: e.target.value})}
                  >
                    <option value="5">5 Minutes</option>
                    <option value="10">10 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="20">20 Minutes</option>
                    <option value="30">30 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="category">
                    <span className="label-icon">📚</span>
                    Category
                  </label>
                  <select
                    id="category"
                    value={config.category}
                    onChange={(e) => setConfig({...config, category: e.target.value})}
                  >
                    <option value="">Any Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="difficulty">
                    <span className="label-icon">⚡</span>
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={config.difficulty}
                    onChange={(e) => setConfig({...config, difficulty: e.target.value})}
                  >
                    <option value="">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="type">
                  <span className="label-icon">❓</span>
                  Question Type
                </label>
                <select
                  id="type"
                  value={config.type}
                  onChange={(e) => setConfig({...config, type: e.target.value})}
                >
                  <option value="">Any Type</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True / False</option>
                </select>
              </div>

              {error && (
                <div className="error-banner">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    <span>Loading Questions...</span>
                  </>
                ) : (
                  <>
                    <span>Start Quiz</span>
                    <span></span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </ClickSpark>
  );
}

export default QuizSetup;
