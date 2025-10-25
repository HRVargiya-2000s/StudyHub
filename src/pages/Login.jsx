"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../styles/Login.css";

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
      <div className="login-card glass">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-book"></i>
          </div>
          <h1 className="gradient-text">StudyHub</h1>
          <p className="login-tagline">Share & Access Your Study Materials Easily</p>
        </div>

        <div className="login-form">
          <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isLoggingIn}>
            <i className="fab fa-google"></i>
            <span>{isLoggingIn ? "Signing in..." : "Continue with Google"}</span>
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Upload & share study materials</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Access materials by class</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Secure & organized storage</span>
            </div>
          </div>

          <p className="terms-text">
            By signing in, you agree to our <a href="#terms">Terms of Service</a>
          </p>
        </div>
      </div>

      <div className="bg-decoration decoration-1"></div>
      <div className="bg-decoration decoration-2"></div>
      <div className="bg-decoration decoration-3"></div>
    </div>
  )
}
