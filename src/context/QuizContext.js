import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizConfig, setQuizConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setQuizConfig(state.quizConfig);
      setQuestions(state.questions);
      setCurrentQuestionIndex(state.currentQuestionIndex);
      setAnswers(state.answers);
      setTimeRemaining(state.timeRemaining);
      setQuizStartTime(state.quizStartTime);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (questions.length > 0) {
      const state = {
        quizConfig,
        questions,
        currentQuestionIndex,
        answers,
        timeRemaining,
        quizStartTime
      };
      localStorage.setItem('quizState', JSON.stringify(state));
    }
  }, [quizConfig, questions, currentQuestionIndex, answers, timeRemaining, quizStartTime]);

  const startQuiz = (config, quizQuestions) => {
    setQuizConfig(config);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeRemaining(config.timeLimit * 60); // Convert minutes to seconds
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
    setQuizConfig(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeRemaining(null);
    setQuizStartTime(null);
    localStorage.removeItem('quizState');
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
