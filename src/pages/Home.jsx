// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <div className="animated-bg"></div>

      {/* Authentication Section */}
      {user ? (
        <div className="user-section">
          <p>Welcome, {user.email}</p>
          <Link to="/dashboard" className="dashboard-link">
            Go to Dashboard
          </Link>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="login-link">
            Login
          </Link>
          <Link to="/register" className="register-link">
            Register
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text animate-on-scroll">
          <h1 className="glowing-text">StudyHub</h1>
          <p className="hero-subtitle">
            Transform your learning experience with next-gen study tools
          </p>
          <div className="hero-buttons">
            {!user && (
              <button
                className="cyber-button"
                onClick={() => navigate("/register")}
              >
                Get Started →
              </button>
            )}
            <button
              className="cyber-button secondary"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image animate-on-scroll">
          {/* Add your hero image or animation here */}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section" ref={featuresRef}>
        <h2 className="section-title animate-on-scroll">Features</h2>
        <div className="feature-grid">
          {[
            {
              title: "Smart Learning",
              description:
                "AI-powered study recommendations and personalized learning paths",
              icon: "🧠",
            },
            {
              title: "Collaborative Space",
              description:
                "Connect with peers and share knowledge in real-time",
              icon: "👥",
            },
            {
              title: "Progress Tracking",
              description: "Visual analytics and progress monitoring",
              icon: "📊",
            },
            {
              title: "Resource Library",
              description:
                "Extensive collection of study materials and resources",
              icon: "📚",
            },
          ].map((feature, index) => (
            <div key={index} className="feature-card animate-on-scroll">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section" ref={aboutRef}>
        <div className="about-content animate-on-scroll">
          <h2 className="section-title">Why Choose StudyHub?</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Modern Learning</h3>
              <p>
                Embrace the future of education with our cutting-edge platform
              </p>
            </div>
            <div className="about-card">
              <h3>Community Driven</h3>
              <p>Join a growing community of passionate learners</p>
            </div>
            <div className="about-card">
              <h3>Always Improving</h3>
              <p>Regular updates and new features based on user feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="testimonials-section"
        ref={testimonialRef}
      >
        <h2 className="section-title animate-on-scroll">What Students Say</h2>
        <div className="testimonials-grid">
          {[
            {
              name: "Alex Johnson",
              role: "Computer Science Student",
              text: "StudyHub transformed how I approach my studies. The AI recommendations are spot-on!",
            },
            {
              name: "Sarah Chen",
              role: "Medical Student",
              text: "The collaborative features helped me connect with study partners worldwide.",
            },
            {
              name: "Mike Peters",
              role: "Engineering Student",
              text: "The progress tracking keeps me motivated and on target with my goals.",
            },
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card animate-on-scroll">
              <p>"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section animate-on-scroll">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Study Resources</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">95%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title animate-on-scroll">How It Works</h2>
        <div className="steps-container">
          <div className="step animate-on-scroll">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account and set your learning preferences</p>
          </div>
          <div className="step animate-on-scroll">
            <div className="step-number">2</div>
            <h3>Explore Resources</h3>
            <p>Browse through our extensive library of study materials</p>
          </div>
          <div className="step animate-on-scroll">
            <div className="step-number">3</div>
            <h3>Start Learning</h3>
            <p>Begin your journey with personalized study paths</p>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="tech-stack-section">
        <h2 className="section-title animate-on-scroll">Powered By</h2>
        <div className="tech-grid">
          {["AI", "Machine Learning", "Cloud Computing", "Real-time Analytics"].map(
            (tech, index) => (
              <div key={index} className="tech-card animate-on-scroll">
                <div className="tech-icon">⚡</div>
                <div className="tech-name">{tech}</div>
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA Section - Only for non-authenticated users */}
      {!user && (
        <section className="cta-section animate-on-scroll">
          <h2>Ready to Transform Your Learning?</h2>
          <button className="cyber-button" onClick={() => navigate("/register")}>
            Join StudyHub Now →
          </button>
        </section>
      )}
    </div>
  );
}
