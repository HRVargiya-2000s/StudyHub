// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    completedCourses: 5,
    inProgress: 3,
    totalTime: '45h',
    avgScore: '85%'
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <h2>StudyHub</h2>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link active">
            <i className="fas fa-home"></i>
            <span>Overview</span>
          </a>
          <a href="#" className="nav-link">
            <i className="fas fa-book"></i>
            <span>Study Materials</span>
          </a>
          <a href="#" className="nav-link">
            <i className="fas fa-chart-line"></i>
            <span>Progress</span>
          </a>
          <a href="#" className="nav-link">
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </a>
        </div>
      </nav>
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>Welcome back, {user?.email?.split('@')[0]}</h1>
            <p>Here's your learning progress</p>
          </div>
          <div className="user-actions">
            <button className="dashboard-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Completed Courses</h3>
              <i className="fas fa-graduation-cap card-icon"></i>
            </div>
            <p className="card-value">{stats.completedCourses} courses</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">In Progress</h3>
              <i className="fas fa-book-reader card-icon"></i>
            </div>
            <p className="card-value">{stats.inProgress} courses</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Study Time</h3>
              <i className="fas fa-clock card-icon"></i>
            </div>
            <p className="card-value">{stats.totalTime}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Average Score</h3>
              <i className="fas fa-chart-line card-icon"></i>
            </div>
            <p className="card-value">{stats.avgScore}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <i className="fas fa-history card-icon"></i>
            </div>
            <ul className="activity-list">
              <li>Completed Python Basics</li>
              <li>Started Web Development</li>
              <li>Achieved 90% in JavaScript Quiz</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Tasks</h3>
              <i className="fas fa-tasks card-icon"></i>
            </div>
            <ul className="activity-list">
              <li>React Fundamentals Quiz</li>
              <li>Node.js Project Submission</li>
              <li>Database Design Workshop</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}