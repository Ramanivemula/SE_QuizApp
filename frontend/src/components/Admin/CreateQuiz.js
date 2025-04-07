import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    questions: [
      {
        text: '',
        type: 'single',
        marks: 1,
        options: ['', '', '', ''],
        correctAnswers: [0]
      }
    ]
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updated = [...quizData.questions];
    updated[index].text = e.target.value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleMarksChange = (index, e) => {
    const updated = [...quizData.questions];
    updated[index].marks = parseInt(e.target.value);
    setQuizData({ ...quizData, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const updated = [...quizData.questions];
    updated[qIndex].options[oIndex] = e.target.value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updated = [...quizData.questions];
    const current = updated[qIndex];

    if (current.type === 'single') {
      current.correctAnswers = [oIndex];
    } else {
      if (current.correctAnswers.includes(oIndex)) {
        current.correctAnswers = current.correctAnswers.filter(i => i !== oIndex);
      } else {
        current.correctAnswers.push(oIndex);
      }
    }

    setQuizData({ ...quizData, questions: updated });
  };

  const handleQuestionTypeChange = (qIndex, type) => {
    const updated = [...quizData.questions];
    updated[qIndex].type = type;
    updated[qIndex].correctAnswers = [];
    setQuizData({ ...quizData, questions: updated });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          text: '',
          type: 'single',
          marks: 1,
          options: ['', '', '', ''],
          correctAnswers: []
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updated = [...quizData.questions];
      updated.splice(index, 1);
      setQuizData({ ...quizData, questions: updated });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz created:', quizData);
    alert('Quiz created successfully!');
    navigate('/admin');
  };

  return (
    <div className="create-quiz-container">
      <header className="admin-header">
        <div className="admin-info">
          <img src={user?.photo} alt="Admin" className="admin-photo" />
          <span>{user?.name}</span>
        </div>
        <button onClick={() => navigate('/admin')} className="back-button">Back to Dashboard</button>
      </header>

      <main className="create-quiz-main">
        <h1>Create New Quiz</h1>

        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="form-group">
            <label>Quiz Title</label>
            <input type="text" name="title" value={quizData.title} onChange={handleQuizChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={quizData.description} onChange={handleQuizChange} required />
          </div>

          <div className="form-group">
            <label>Time Limit (minutes)</label>
            <input type="number" name="timeLimit" value={quizData.timeLimit} onChange={handleQuizChange} min="1" required />
          </div>

          <h3>Questions</h3>

          {quizData.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-header">
                <h4>Question {qIndex + 1}</h4>
                <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-question">Remove</button>
              </div>

              <div className="form-group">
                <label>Question Text</label>
                <input type="text" value={question.text} onChange={(e) => handleQuestionChange(qIndex, e)} required />
              </div>

              <div className="form-group">
                <label>Marks</label>
                <input
                  type="number"
                  value={question.marks}
                  min="1"
                  onChange={(e) => handleMarksChange(qIndex, e)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Answer Type</label>
                <select value={question.type} onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}>
                  <option value="single">Single Correct</option>
                  <option value="multiple">Multiple Correct</option>
                </select>
              </div>

              <div className="options-group">
                <label>Options</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="option-input">
                    <input
                      type={question.type === 'single' ? 'radio' : 'checkbox'}
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswers.includes(oIndex)}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button type="button" onClick={addQuestion} className="add-question">Add Question</button>
            <button type="submit" className="submit-quiz">Create Quiz</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuiz;
