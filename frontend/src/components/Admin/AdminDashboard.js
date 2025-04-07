import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';
import { FiLogOut, FiBarChart2, FiUserPlus, FiFilePlus, FiEye } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-info">
          <img src={user?.photo} alt="Admin" className="admin-photo" />
          <span>Welcome, {user?.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FiLogOut size={18} /> Logout
        </button>
      </header>

      <main className="admin-main">
        <h1>Admin Dashboard</h1>

        <section className="analytics-section">
          <h2><FiBarChart2 /> Analytics Overview</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>120</h3>
              <p>Total Quizzes</p>
            </div>
            <div className="analytics-card">
              <h3>420</h3>
              <p>Students Enrolled</p>
            </div>
            <div className="analytics-card">
              <h3>96%</h3>
              <p>Average Score</p>
            </div>
          </div>
        </section>

        <section className="admin-actions">
          <Link to="/admin/create-quiz" className="action-card">
            <FiFilePlus className="action-icon" />
            <h3>Create New Quiz</h3>
            <p>Design and publish a new quiz for students</p>
          </Link>

          <div className="action-card">
            <FiEye className="action-icon" />
            <h3>View Quiz Results</h3>
            <p>Check how students performed on quizzes</p>
          </div>

          <div className="action-card">
            <FiUserPlus className="action-icon" />
            <h3>Manage Users</h3>
            <p>Add or remove student accounts</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
