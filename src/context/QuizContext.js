import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [quizConfig, setQuizConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const resetQuizState = () => {
    setQuizConfig(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeRemaining(null);
    setQuizStartTime(null);
  };

  useEffect(() => {
    if (authLoading) return;
    
    setLoading(true);
    if (user) {
      const storageKey = `quizState_${user.username}`;
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        setQuizConfig(state.quizConfig);
        setQuestions(state.questions);
        setCurrentQuestionIndex(state.currentQuestionIndex);
        setAnswers(state.answers);
        setQuizStartTime(state.quizStartTime);

        if (state.quizStartTime && state.quizConfig) {
          const totalDuration = state.quizConfig.timeLimit * 60;
          const elapsedTime = Math.floor((Date.now() - state.quizStartTime) / 1000);
          const remainingTime = totalDuration - elapsedTime;
          setTimeRemaining(Math.max(0, remainingTime));
        } else {
          setTimeRemaining(state.timeRemaining);
        }
      } else {
        resetQuizState();
      }
    }
    setLoading(false);
  }, [user, authLoading]);

  useEffect(() => {
    if (user && questions.length > 0) {
      const storageKey = `quizState_${user.username}`;
      const state = {
        quizConfig,
        questions,
        currentQuestionIndex,
        answers,
        timeRemaining,
        quizStartTime
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [user, quizConfig, questions, currentQuestionIndex, answers, timeRemaining, quizStartTime]);

  const startQuiz = (config, quizQuestions) => {
    setQuizConfig(config);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeRemaining(config.timeLimit * 60);
    setQuizStartTime(Date.now());
  };

  const answerQuestion = (answer) => {
    const newAnswers = [...answers, {
      questionIndex: currentQuestionIndex,
      answer,
      timestamp: Date.now()
    }];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const resetQuiz = () => {
    resetQuizState();
    if (user) {
      const storageKey = `quizState_${user.username}`;
      localStorage.removeItem(storageKey);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    
    answers.forEach(answer => {
      const question = questions[answer.questionIndex];
      if (question && answer.answer === question.correct_answer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return {
      correct,
      wrong,
      unanswered: questions.length - answers.length,
      total: questions.length,
      percentage: ((correct / questions.length) * 100).toFixed(2)
    };
  };

  return (
    <QuizContext.Provider value={{
      quizConfig,
      questions,
      currentQuestionIndex,
      answers,
      timeRemaining,
      quizStartTime,
      loading,
      setTimeRemaining,
      startQuiz,
      answerQuestion,
      resetQuiz,
      calculateResults
    }}>
      {children}
    </QuizContext.Provider>
  );
};
