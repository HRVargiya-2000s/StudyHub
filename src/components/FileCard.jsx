"use client"

import { useState } from "react"
import { db, storage } from "../config/firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import "../styles/FileCard.css"

export default function FileCard({ material }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const getCategoryIcon = (category) => {
    const icons = {
      Notes: "fa-file-alt",
      "Lab Manual": "fa-flask",
      Book: "fa-book",
      "Practical File": "fa-folder",
      Notification: "fa-bell",
    }
    return icons[category] || "fa-file"
  }

  const getCategoryColor = (category) => {
    const colors = {
      Notes: "#00ffff",
      "Lab Manual": "#9b30ff",
      Book: "#00ffff",
      "Practical File": "#9b30ff",
      Notification: "#ef4444",
    }
    return colors[category] || "#00ffff"
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const link = document.createElement("a")
      link.href = material.fileURL
      link.download = material.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download file")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this material?")) return

    setIsDeleting(true)
    try {
      await deleteDoc(doc(db, "materials", material.id))
      if (material.fileURL) {
        const fileRef = ref(storage, material.fileURL)
        await deleteObject(fileRef)
      }
    } catch (error) {
      alert("Failed to delete material.")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="file-card glass">
      <div className="card-header">
        <div className="category-badge" style={{ borderColor: getCategoryColor(material.category) }}>
          <i className={`fas ${getCategoryIcon(material.category)}`}></i>
          <span>{material.category}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="file-name" title={material.fileName}>
          {material.fileName}
        </h3>

        <div className="file-meta">
          <div className="meta-item">
            <i className="fas fa-user"></i>
            <span>{material.uploadedBy}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-calendar"></i>
            <span>{formatDate(material.uploadDate)}</span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button className="action-btn view-btn" title="View">
          <i className="fas fa-eye"></i>
          <span>View</span>
        </button>
        <button className="action-btn download-btn" onClick={handleDownload} disabled={isDownloading} title="Download">
          <i className="fas fa-download"></i>
          <span>{isDownloading ? "..." : "Download"}</span>
        </button>
        {material.isOwner && (
          <button className="action-btn delete-btn" onClick={handleDelete} disabled={isDeleting} title="Delete">
            <i className="fas fa-trash"></i>
            <span>{isDeleting ? "..." : "Delete"}</span>
          </button>
        )}
      </div>
    </div>
  )
}
