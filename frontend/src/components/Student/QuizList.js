import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const mockQuizzes = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Test your knowledge of fundamental JavaScript concepts',
    timeLimit: 20,
    questionCount: 10
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Quiz on React components, state, and props',
    timeLimit: 30,
    questionCount: 15
  },
  {
    id: '3',
    title: 'CSS Styling',
    description: 'How well do you know CSS? Take this quiz to find out!',
    timeLimit: 15,
    questionCount: 8
  }
];

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="quiz-dashboard">
      <style>
        {`
          .quiz-dashboard {
            font-family: 'Segoe UI', sans-serif;
            min-height: 100vh;
            background: url('https://images.unsplash.com/photo-1607082349566-c93356c3db40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80') no-repeat center center/cover;
            padding: 20px;
            backdrop-filter: brightness(0.9);
          }
          .student-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 32px;
            background: rgba(30, 41, 59, 0.9);
            color: white;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
          .student-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .student-photo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid white;
          }
          .logout-button {
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s ease;
          }
          .logout-button:hover {
            background: #dc2626;
          }
          .student-main h1 {
            font-size: 2rem;
            color: black;
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
          }
          .loading {
            text-align: center;
            font-size: 1.2rem;
            margin-top: 40px;
            color: white;
          }
          .quizzes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            padding: 0 10px;
          }
          .quiz-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .quiz-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          }
          .quiz-card h3 {
            margin-top: 0;
            color: #1e293b;
          }
          .quiz-card p {
            color: #4b5563;
          }
          .quiz-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            color: #6b7280;
            font-size: 0.9rem;
          }
          .start-quiz-button {
            display: inline-block;
            margin-top: 15px;
            background: #3b82f6;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.3s ease;
          }
          .start-quiz-button:hover {
            background: #2563eb;
          }

          @media (max-width: 480px) {
            .student-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }
          }
        `}
      </style>

      <header className="student-header">
        <div className="student-info">
          <img src={user?.photo} alt="Student" className="student-photo" />
          <span>Welcome, {user?.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <main className="student-main">
        <h1>Available Quizzes</h1>
        {loading ? (
          <div className="loading">Loading quizzes...</div>
        ) : (
          <div className="quizzes-grid">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                  <span>⏱ {quiz.timeLimit} mins</span>
                  <span>📋 {quiz.questionCount} questions</span>
                </div>
                <Link to={`/quiz/${quiz.id}`} className="start-quiz-button">Start Quiz</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizList;
