import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('quizUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    const userData = {
      username,
      loginTime: new Date().toISOString()
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('quizUser', JSON.stringify(userData));
  };

  const logout = () => {
    const username = user?.username;
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('quizUser');
    
    if (username) {
      localStorage.removeItem(`quizState_${username}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
