"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "../styles/Navbar.css";  // ← Changed from "./Navbar.css"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/home")}>
          <div className="logo-icon">📚</div>
          <span className="logo-text">StudyHub</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {user && (
            <>
              <button className="nav-link" onClick={() => navigate("/home")}>
                Materials
              </button>
              <button className="nav-link" onClick={() => navigate("/profile")}>
                Profile
              </button>
              <div className="nav-divider"></div>
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {user && (
              <>
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    navigate("/home")
                    setIsMenuOpen(false)
                  }}
                >
                  Materials
                </button>
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    navigate("/profile")
                    setIsMenuOpen(false)
                  }}
                >
                  Profile
                </button>
                <button
                  className="mobile-nav-link logout-btn"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
