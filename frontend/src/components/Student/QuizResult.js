import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Student.css';

const QuizResult = () => {
  const location = useLocation();
  const { score, totalQuestions, quizTitle } = location.state || { score: 0, totalQuestions: 1, quizTitle: 'Quiz' };
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const percentage = Math.round((score / totalQuestions) * 100);
  let performanceMessage = '';
  let performanceClass = '';

  if (percentage >= 80) {
    performanceMessage = 'Excellent!';
    performanceClass = 'excellent';
  } else if (percentage >= 60) {
    performanceMessage = 'Good job!';
    performanceClass = 'good';
  } else if (percentage >= 40) {
    performanceMessage = 'Not bad!';
    performanceClass = 'average';
  } else {
    performanceMessage = 'Keep practicing!';
    performanceClass = 'poor';
  }

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  return (
    <div className="quiz-result">
      <header className="result-header">
        <div className="user-profile">
          <img src={user?.photo} alt="User" className="user-photo" />
          <span>{user?.name}</span>
        </div>
      </header>
      
      <main className="result-main">
        <div className={`result-card ${performanceClass}`}>
          <h2>Quiz Results: {quizTitle}</h2>
          
          <div className="score-circle">
            <div className="score-value">{percentage}%</div>
            <div className="score-detail">{score} out of {totalQuestions} correct</div>
          </div>
          
          <div className="performance-message">{performanceMessage}</div>
          
          <button onClick={handleBackToQuizzes} className="back-button">
            Back to Quizzes
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizResult;