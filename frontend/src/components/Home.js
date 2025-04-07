import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <header className="hero-section">
          <h1>Welcome to <span className="brand">QuizMaster</span></h1>
          <p>Test your knowledge and challenge yourself with interactive quizzes</p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-button student">Student Login</Link>
            <Link to="/login" className="cta-button admin">Admin Login</Link>
          </div>
        </header>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📚 Interactive Quizzes</h3>
              <p>Engage with quizzes across a range of topics to sharpen your skills.</p>
            </div>
            <div className="feature-card">
              <h3>⚡ Real-time Results</h3>
              <p>Instant feedback and scores right after you complete a quiz.</p>
            </div>
            <div className="feature-card">
              <h3>⏱️ Time-bound Tests</h3>
              <p>Push your limits and improve your time management with timed challenges.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
