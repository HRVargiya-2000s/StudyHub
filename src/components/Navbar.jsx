// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}>
      <div className="nav-inner">
        <button className="brand" onClick={() => { closeMenu(); navigate('/'); }}>
          <span className="logo-text">StudyHub</span>
        </button>

        {/* Desktop row */}
        <ul className="nav-links-desktop">
          <li><a href="#features" className="nav-link">Features</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#testimonials" className="nav-link">Testimonials</a></li>
          {user && (
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          )}
        </ul>

        <div className="nav-actions-desktop">
          {user ? (
            <button className="btn outline danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="btn outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn solid" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </div>

        {/* Burger */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'show' : ''}`}>
        <a href="#features" className="m-link" onClick={closeMenu}>Features</a>
        <a href="#about" className="m-link" onClick={closeMenu}>About</a>
        <a href="#testimonials" className="m-link" onClick={closeMenu}>Testimonials</a>
        {user && (
          <Link to="/dashboard" className="m-link" onClick={closeMenu}>Dashboard</Link>
        )}
        <div className="m-actions">
          {user ? (
            <button className="btn outline danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="btn outline" onClick={() => { closeMenu(); navigate('/login'); }}>Login</button>
              <button className="btn solid" onClick={() => { closeMenu(); navigate('/register'); }}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}