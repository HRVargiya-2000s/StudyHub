"use client"

import { useState } from "react"
import { ref, getBytes } from "firebase/storage"
import { storage } from "../config/firebase"
import "../styles/FileCard.css";  // ← Changed from "./FileCard.css"

export default function FileCard({ material }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const getCategoryColor = (category) => {
    const colors = {
      Notes: "#6366f1",
      "Lab Manual": "#ec4899",
      Book: "#10b981",
      "Practical File": "#f59e0b",
      Notification: "#ef4444",
    }
    return colors[category] || "#6b7280"
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase()
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "🎯",
      pptx: "🎯",
      zip: "📦",
      rar: "📦",
      txt: "📋",
      jpg: "🖼️",
      png: "🖼️",
      jpeg: "🖼️",
    }
    return icons[ext] || "📎"
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const fileRef = ref(storage, material.fileUrl)
      const bytes = await getBytes(fileRef)
      const blob = new Blob([bytes])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = material.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download file")
    } finally {
      setIsDownloading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ""
    const d = new Date(date.seconds * 1000)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="file-card">
      <div className="card-header">
        <div className="file-icon">{getFileIcon(material.fileName)}</div>
        <div className="category-tag" style={{ backgroundColor: getCategoryColor(material.category) }}>
          {material.category}
        </div>
      </div>

      <div className="card-content">
        <h3 className="file-name" title={material.fileName}>
          {material.fileName}
        </h3>

        <div className="file-meta">
          <span className="uploader">By {material.uploadedBy}</span>
          <span className="upload-date">{formatDate(material.uploadDate)}</span>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? "⏳ Downloading..." : "⬇️ Download"}
      </button>
    </div>
  )
}
