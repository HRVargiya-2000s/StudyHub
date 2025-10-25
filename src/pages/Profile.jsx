"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import "../styles/Profile.css";  // ← Changed from "./Profile.css"

export default function Profile() {
  const { user, userData, loading } = useAuth()
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState(userData?.class || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const classes = ["10th", "11th", "12th", "B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year"]

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [user, loading, navigate])

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
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL || "/placeholder.svg"} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user?.displayName || "User"}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Select Your Class</h2>
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
            <div className={`message ${saveMessage.includes("successfully") ? "success" : "error"}`}>{saveMessage}</div>
          )}

          <button className="save-btn" onClick={handleSaveClass} disabled={isSaving || !selectedClass}>
            {isSaving ? "Saving..." : "Save Class"}
          </button>
        </div>

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Current Class</label>
              <p>{userData?.class || "Not selected"}</p>
            </div>
            <div className="info-item">
              <label>Account Created</label>
              <p>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
