import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer glass-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-book"></i>
              <span>StudyHub</span>
            </div>
            <p className="footer-description">Share & access study materials with your classmates</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#home">
                  <i className="fas fa-home"></i> Home
                </a>
              </li>
              <li>
                <a href="#profile">
                  <i className="fas fa-user"></i> Profile
                </a>
              </li>
              <li>
                <a href="#materials">
                  <i className="fas fa-book"></i> Materials
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#github" className="social-icon" title="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="#twitter" className="social-icon" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#linkedin" className="social-icon" title="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#email" className="social-icon" title="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; 2025 StudyHub. All rights reserved.</p>
          <p>
            Made with <i className="fas fa-heart"></i> for Students
          </p>
        </div>
      </div>
    </footer>
  )
}
