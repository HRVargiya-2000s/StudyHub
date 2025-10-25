"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, userData, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (!user) return null

  return (
    <nav className="navbar glass-nav">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/home")}>
          <div className="logo-icon">
            <i className="fas fa-book"></i>
          </div>
          <span className="logo-text gradient-text">StudyHub</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {user && (
            <>
              <button className="nav-link" onClick={() => navigate("/home")}>
                <i className="fas fa-home"></i>
                <span>Home</span>
              </button>
              <button className="nav-link" onClick={() => navigate("/profile")}>
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
              </button>

              {userData?.class && (
                <div className="class-selector">
                  <i className="fas fa-graduation-cap"></i>
                  <span>{userData.class}</span>
                </div>
              )}

              <div className="profile-dropdown-container">
                <button className="profile-button" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                  <div className="avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <span>{user?.displayName?.split(" ")[0]}</span>
                  <i className="fas fa-chevron-down"></i>
                </button>

                {isProfileDropdownOpen && (
                  <div className="profile-dropdown glass">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div>
                        <p className="dropdown-name">{user?.displayName}</p>
                        <p className="dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/profile")
                        setIsProfileDropdownOpen(false)
                      }}
                    >
                      <i className="fas fa-cog"></i>
                      <span>Profile Settings</span>
                    </button>
                    <button
                      className="dropdown-item logout"
                      onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false)
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu glass">
            {user && (
              <>
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    navigate("/home")
                    setIsMenuOpen(false)
                  }}
                >
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </button>
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    navigate("/profile")
                    setIsMenuOpen(false)
                  }}
                >
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </button>
                {userData?.class && (
                  <div className="mobile-class-info">
                    <i className="fas fa-graduation-cap"></i>
                    <span>{userData.class}</span>
                  </div>
                )}
                <button
                  className="mobile-nav-link logout-btn"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
