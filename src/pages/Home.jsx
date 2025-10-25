"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "../config/firebase"
import FileCard from "../components/FileCard"
import UploadModal from "../components/UploadModal"
import Footer from "../components/Footer"
import "../styles/Home.css"

export default function Home() {
  const { user, userData } = useAuth()
  const navigate = useNavigate()
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const categories = ["All", "Notes", "Lab Manual", "Book", "Practical File", "Notification"]

  useEffect(() => {
    if (!userData?.class) {
      navigate("/profile")
    }
  }, [userData, navigate])

  useEffect(() => {
    if (!userData?.class) return

    setLoading(true)

    const materialsRef = collection(db, "materials")
    const q = query(materialsRef, where("class", "==", userData.class), orderBy("uploadDate", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const materialsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isOwner: doc.data().uploaderUID === user?.uid,
      }))
      setMaterials(materialsData)
      setFilteredMaterials(materialsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userData?.class, user?.uid])

  useEffect(() => {
    let filtered = materials

    if (selectedCategory !== "All") {
      filtered = filtered.filter((material) => material.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (material) =>
          material.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredMaterials(filtered)
  }, [searchQuery, selectedCategory, materials])

  if (!userData?.class) {
    return (
      <div className="home-container">
        <div className="class-required glass">
          <div className="class-required-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2>Class Required</h2>
          <p>You need to set your class in profile settings to access materials.</p>
          <button onClick={() => navigate("/profile")} className="primary-btn">
            <i className="fas fa-arrow-right"></i>
            Go to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="home-header">
          <div className="header-content">
            <div>
              <h1 className="gradient-text">
                <i className="fas fa-book"></i>
                Study Materials
              </h1>
              <p className="header-subtitle">Discover and share study materials with your classmates</p>
            </div>
            <button onClick={() => setIsUploadModalOpen(true)} className="upload-btn">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Upload Material</span>
            </button>
          </div>
        </div>

        <div className="search-filter-section">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search materials or uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Materials Grid */}
        <div className="materials-section">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading materials...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="empty-state glass">
              <div className="empty-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h3>No materials found</h3>
              <p>
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search or filter"
                  : "Be the first to upload study materials for your class"}
              </p>
              {!searchQuery && selectedCategory === "All" && (
                <button onClick={() => setIsUploadModalOpen(true)} className="primary-btn">
                  <i className="fas fa-plus"></i>
                  Upload First Material
                </button>
              )}
            </div>
          ) : (
            <div className="materials-grid">
              {filteredMaterials.map((material) => (
                <FileCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Upload Modal */}
      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
    </div>
  )
}
