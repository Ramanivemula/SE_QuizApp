import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import Reports from "../pages/admin/Reports";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import CreateQuiz from "../pages/teacher/CreateQuiz";
import ManageStudents from "../pages/teacher/ManageStudents";

import StudentDashboard from "../pages/student/StudentDashboard";
import Quiz from "../pages/student/Quiz";
import Leaderboard from "../pages/student/Leaderboard";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path="/teacher/manage-students" element={<ManageStudents />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/quiz/:id" element={<Quiz />} />
        <Route path="/student/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
