import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Login from './pages/Login';
import QuizSetup from './pages/QuizSetup';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import './App.css';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/setup"
                  element={
                    <PrivateRoute>
                      <QuizSetup />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/quiz"
                  element={
                    <PrivateRoute>
                      <Quiz />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <PrivateRoute>
                      <Results />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </Router>
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
