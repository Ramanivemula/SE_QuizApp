import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Student.css';

// Mock quiz data
const mockQuiz = {
  id: '1',
  title: 'JavaScript Basics',
  timeLimit: 1,
  questions: [
    {
      id: '1',
      text: 'Which of the following is not a JavaScript data type?',
      options: ['String', 'Boolean', 'Number', 'Float'],
      correctAnswer: 3
    },
    {
      id: '2',
      text: 'What does the "===" operator do in JavaScript?',
      options: [
        'Checks for equality without type conversion',
        'Checks for equality with type conversion',
        'Assigns a value to a variable',
        'None of the above'
      ],
      correctAnswer: 0
    },
    {
      id: '3',
      text: 'Which keyword is used to declare a variable in JavaScript?',
      options: ['var', 'let', 'const', 'All of the above'],
      correctAnswer: 3
    },
    {
      id: '4',
      text: 'What is the output of: console.log(typeof null)?',
      options: ['"null"', '"undefined"', '"object"', '"string"'],
      correctAnswer: 2
    },
    {
      id: '5',
      text: 'Which method creates a new array with all elements that pass the test?',
      options: ['map()', 'filter()', 'reduce()', 'forEach()'],
      correctAnswer: 1
    }
  ]
};

const QuizPortal = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    if (!quiz) return;
    let score = 0;
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });

    navigate('/quiz-result', {
      state: {
        score,
        totalQuestions: quiz.questions.length,
        quizTitle: quiz.title,
        selectedAnswers,
        questions: quiz.questions,
        markedForReview
      }
    });
  }, [quiz, selectedAnswers, navigate, markedForReview]);

  useEffect(() => {
    setTimeout(() => {
      setQuiz(mockQuiz);
      setTimeLeft(mockQuiz.timeLimit * 60);
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, handleSubmit]);

  const startQuiz = () => {
    setQuizStarted(true);
    setVisitedQuestions((prev) => ({ ...prev, [quiz.questions[0].id]: true }));
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => ({ ...prev, [quiz.questions[index].id]: true }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getQuestionStatus = (questionId, index) => {
    if (currentQuestionIndex === index) return 'current';
    if (markedForReview[questionId]) return 'marked';
    if (selectedAnswers[questionId] !== undefined) return 'attempted';
    if (visitedQuestions[questionId]) return 'visited';
    return 'unvisited';
  };

  // Enhanced Status Counts
  const markedCount = Object.keys(markedForReview).filter((key) => markedForReview[key]).length;
  const unvisitedCount = quiz?.questions.filter(
    (q) => selectedAnswers[q.id] === undefined && !visitedQuestions[q.id]
  ).length;

  if (loading) return <div className="loading">Loading quiz...</div>;

  if (!quizStarted) {
    return (
      <div className="quiz-start-screen">
        <div className="quiz-info-card">
          <h2>{quiz?.title}</h2>
          <p>Time Limit: {quiz?.timeLimit} minute(s)</p>
          <p>Number of Questions: {quiz?.questions.length}</p>
          <button onClick={startQuiz} className="start-quiz-btn">Start Quiz</button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  return (
    <div className="quiz-portal-container">
      <div className="quiz-sidebar">
        <div className="user-profile-card">
          <img src={user?.photo} alt="User" className="user-photo" />
          <div className="user-details">
            <h4>{user?.name}</h4>
            <p>Student</p>
          </div>
        </div>

        <div className="quiz-timer-sidebar">
          <span>Time Remaining:</span>
          <span className="time">{formatTime(timeLeft)}</span>
        </div>

        <div className="questions-navigation">
          <h4>Questions</h4>
          <div className="question-buttons">
            {quiz?.questions.map((question, index) => (
              <div className="question-wrapper" key={question.id}>
                <button
                  className={`question-btn ${getQuestionStatus(question.id, index)}`}
                  onClick={() => handleQuestionNavigation(index)}
                >
                  {index + 1}
                </button>
                {currentQuestionIndex === index && <div className="triangle-indicator"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="attempt-status">
          <div className="status-item">
            <span className="triangle-icon attempted"><span className="count">✓</span></span>Answered
          </div>
          <div className="status-item">
            <span className="triangle-icon unvisited"><span className="count">{unvisitedCount}</span></span>Not Answered
          </div>
          <div className="status-item">
            <span className="triangle-icon visited"></span>Visited
          </div>
          <div className="status-item">
            <span className="triangle-icon marked"><span className="count">{markedCount}</span></span>Marked
          </div>
          <div className="status-item">
            <span className="triangle-icon current"></span>Current
          </div>
        </div>
      </div>

      <div className="quiz-content">
        <header className="quiz-header">
          <h2>{quiz?.title}</h2>
          <div className="quiz-timer-main">Time Left: <span className="time">{formatTime(timeLeft)}</span></div>
        </header>

        <main className="quiz-main">
          <div className="quiz-progress">
            Question {currentQuestionIndex + 1} of {quiz?.questions.length}
          </div>

          <div className="question-container">
            <div className="question-header">
              <h3 className="question-text">{currentQuestion?.text}</h3>
              <button
                onClick={() => toggleMarkForReview(currentQuestion.id)}
                className={`mark-review-btn ${markedForReview[currentQuestion.id] ? 'marked' : ''}`}
              >
                {markedForReview[currentQuestion.id] ? '✓ Marked' : 'Mark for Review'}
              </button>
            </div>

            <div className="options-list">
              {currentQuestion?.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${selectedAnswers[currentQuestion.id] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              onClick={() => handleQuestionNavigation(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="nav-button prev"
            >
              Previous
            </button>

            <button
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={`mark-review-btn ${markedForReview[currentQuestion.id] ? 'marked' : ''}`}
            >
              {markedForReview[currentQuestion.id] ? 'Unmark' : 'Mark'}
            </button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button onClick={handleSubmit} className="submit-button">Submit Quiz</button>
            ) : (
              <button
                onClick={() => handleQuestionNavigation(currentQuestionIndex + 1)}
                className="nav-button next"
              >
                Next
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizPortal;
