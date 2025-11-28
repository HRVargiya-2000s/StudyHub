// src/components/DashboardNav.jsx - CREATE NEW FILE
import { Link, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function DashboardNav() {
  const location = useLocation();
  
  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <h2>StudyHub</h2>
      </div>
      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <i className="fas fa-home"></i> 
          <span>Overview</span>
        </Link>
        <Link 
          to="/dashboard/materials" 
          className={`nav-link ${location.pathname === '/dashboard/materials' ? 'active' : ''}`}
        >
          <i className="fas fa-book"></i>
          <span>Study Materials</span>
        </Link>
        <Link 
          to="/dashboard/progress" 
          className={`nav-link ${location.pathname === '/dashboard/progress' ? 'active' : ''}`}
        >
          <i className="fas fa-chart-line"></i>
          <span>Progress</span>
        </Link>
        <Link 
          to="/dashboard/profile" 
          className={`nav-link ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}
        >
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}