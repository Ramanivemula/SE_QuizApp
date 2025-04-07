import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // 'admin' or 'student'
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Mock authentication - in a real app, you'd call an API
    if (formData.email && formData.password) {
      const user = {
        email: formData.email,
        role: formData.role,
        name: formData.role === 'admin' ? 'Admin User' : 'Student User',
        photo: formData.role === 'admin' ? '/assets/admin.png' : '/assets/user.png'
      };
      login(user);
      
      if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/quizzes');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Quiz App Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Login as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;