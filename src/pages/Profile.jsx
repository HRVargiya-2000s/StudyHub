"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import Footer from "../components/Footer"
import "../styles/Profile.css"

export default function Profile() {
  const { user, userData, loading } = useAuth()
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState(userData?.class || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [stats, setStats] = useState({ uploads: 0, downloads: 0, followers: 0 })

  const classes = ["10th", "11th", "12th", "B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year"]

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (userData?.class) {
      setSelectedClass(userData.class)
    }
  }, [userData])

  const handleSaveClass = async () => {
    if (!selectedClass) {
      setSaveMessage("Please select a class")
      return
    }

    try {
      setIsSaving(true)
      setSaveMessage("")

      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        class: selectedClass,
      })

      setSaveMessage("Class updated successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error updating class:", error)
      setSaveMessage("Failed to update class")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card glass">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="profile-info">
              <h1>{user?.displayName || "User"}</h1>
              <p className="profile-email">{user?.email}</p>
            </div>
            <button className="edit-profile-btn">
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-icon uploads">
                <i className="fas fa-file-upload"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.uploads}</div>
                <div className="stat-label">Uploads</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon downloads">
                <i className="fas fa-download"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.downloads}</div>
                <div className="stat-label">Downloads</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon followers">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.followers}</div>
                <div className="stat-label">Followers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection Section */}
        <div className="profile-section glass">
          <h2>
            <i className="fas fa-graduation-cap"></i>
            Select Your Class
          </h2>
          <p className="section-description">Choose your class to access relevant study materials</p>

          <div className="class-grid">
            {classes.map((cls) => (
              <button
                key={cls}
                className={`class-option ${selectedClass === cls ? "active" : ""}`}
                onClick={() => setSelectedClass(cls)}
              >
                {cls}
              </button>
            ))}
          </div>

          {saveMessage && (
            <div className={`message ${saveMessage.includes("successfully") ? "success" : "error"}`}>
              <i
                className={`fas ${saveMessage.includes("successfully") ? "fa-check-circle" : "fa-exclamation-circle"}`}
              ></i>
              {saveMessage}
            </div>
          )}

          <button className="save-btn" onClick={handleSaveClass} disabled={isSaving || !selectedClass}>
            <i className="fas fa-save"></i>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Account Information Section */}
        <div className="profile-section glass">
          <h2>
            <i className="fas fa-info-circle"></i>
            Account Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>
                <i className="fas fa-graduation-cap"></i>
                Current Class
              </label>
              <p>{userData?.class || "Not selected"}</p>
            </div>
            <div className="info-item">
              <label>
                <i className="fas fa-calendar"></i>
                Account Created
              </label>
              <p>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Account Actions Section */}
        <div className="profile-section glass">
          <h2>
            <i className="fas fa-cog"></i>
            Account Actions
          </h2>
          <div className="actions-grid">
            <button className="action-card">
              <i className="fas fa-lock"></i>
              <span>Change Password</span>
            </button>
            <button className="action-card logout">
              <i className="fas fa-sign-out-alt"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
