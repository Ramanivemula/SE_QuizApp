import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateQuiz from './components/Admin/CreateQuiz';
import QuizList from './components/Student/QuizList';
import QuizPortal from './components/Student/QuizPortal';
import QuizResult from './components/Student/QuizResult';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizPortal /></ProtectedRoute>} />
          <Route path="/quiz-result" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;