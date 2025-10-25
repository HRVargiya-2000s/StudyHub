// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome to StudyHub</h2>
          <p>Sign in with your Google account to access study materials</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="social-auth">
          <button
            className="social-button google"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <i className="fab fa-google"></i>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        <p className="auth-note">
          By signing in, you'll be able to upload and access study materials for your class.
        </p>
      </div>
    </div>
  );
}
