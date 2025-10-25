"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { db, storage } from "../config/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import "../styles/UploadModal.css"

export default function UploadModal({ onClose }) {
  const { user, userData } = useAuth()
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [category, setCategory] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const categories = ["Notes", "Lab Manual", "Book", "Practical File", "Notification"]

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size should not exceed 10MB")
        return
      }
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file || !category || !fileName.trim()) {
      alert("Please fill all fields and select a file")
      return
    }

    if (!userData?.class) {
      alert("Please set your class in profile settings first")
      return
    }

    setUploading(true)

    try {
      const fileRef = ref(storage, `materials/${userData.class}/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(fileRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(Math.round(progress))
        },
        (error) => {
          console.error("Upload error:", error)
          alert("Upload failed. Please try again.")
          setUploading(false)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          await addDoc(collection(db, "materials"), {
            fileName: fileName.trim(),
            category,
            fileURL: downloadURL,
            class: userData.class,
            uploadedBy: user.displayName,
            uploaderUID: user.uid,
            uploadDate: serverTimestamp(),
          })

          alert("Material uploaded successfully!")
          onClose()
        },
      )
    } catch (error) {
      console.error("Error uploading material:", error)
      alert("Failed to upload material. Please try again.")
      setUploading(false)
    }
  }

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal glass" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="gradient-text">
            <i className="fas fa-cloud-upload-alt"></i>
            Upload Material
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="upload-form">
          {/* Material Name Input */}
          <div className="form-group">
            <label htmlFor="fileName">
              <i className="fas fa-file-alt"></i>
              Material Name *
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., Data Structures Notes - Unit 1"
              className="form-input"
              disabled={uploading}
              required
            />
          </div>

          {/* Category Select */}
          <div className="form-group">
            <label htmlFor="category">
              <i className="fas fa-tag"></i>
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              disabled={uploading}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label htmlFor="file">
              <i className="fas fa-paperclip"></i>
              File *
            </label>
            <div className="file-input-wrapper">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                disabled={uploading}
                required
              />
              <div className="file-input-label">
                <i className="fas fa-upload"></i>
                <span>{file ? file.name : "Click to select file or drag & drop"}</span>
              </div>
            </div>
            <p className="file-hint">
              <i className="fas fa-info-circle"></i>
              Supported: PDF, DOCX, DOC, JPG, PNG (Max 10MB)
            </p>
          </div>

          {/* Class Info */}
          <div className="class-info">
            <i className="fas fa-graduation-cap"></i>
            <span>
              Uploading to: <strong>{userData?.class}</strong>
            </span>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="progress-section">
              <div className="progress-label">
                <span>Uploading...</span>
                <span className="progress-percent">{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={uploading}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              <i className="fas fa-check"></i>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
