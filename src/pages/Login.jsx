"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../styles/Login.css";  // ← Changed from "./Login.css"

export default function Login() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      navigate("/profile")
    }
  }, [user, loading, navigate])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true)
      await signInWithGoogle()
    } catch (error) {
      console.error("Login error:", error)
      alert("Failed to sign in. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  if (loading) {
    return (
      <div className="login-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="login-container">
      {/* Left Section - Branding */}
      <div className="login-left">
        <div className="login-content">
          <div className="login-logo">
            <div className="logo-circle">📚</div>
          </div>

          <h1 className="login-title">StudyHub</h1>
          <p className="login-subtitle">Your Academic Material Platform</p>

          <p className="login-description">
            Upload, share, and access study materials securely with your classmates. Organize your learning journey with
            ease.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Upload & share study materials</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Access materials by class</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure & organized storage</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Collaborate with classmates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Sign in to access your study materials</p>

          <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isLoggingIn}>
            <svg className="google-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoggingIn ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <p className="terms-text">
            By signing in, you agree to our <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
      </div>
    </div>
  )
}
