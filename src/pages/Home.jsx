// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import Navbar from '../components/Navbar';
import FileCard from '../components/FileCard';
import UploadModal from '../components/UploadModal';

const categories = [
  'All',
  'Notes',
  'Lab Manual',
  'Book',
  'Practical File',
  'Notification'
];

export default function Home() {
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Fetch materials for user's class
  useEffect(() => {
    // Only set up listener if user is authenticated, auth is loaded, and has a class set
    if (!user || authLoading || !userData?.class) {
      setMaterials([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'materials'),
        where('class', '==', userData.class),
        orderBy('uploadDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const materialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMaterials(materialsData);
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error('Error fetching materials:', error);
        setError('Failed to load materials. This might be due to Firestore configuration issues.');
        setLoading(false);
        setMaterials([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
      setError('Failed to connect to database. Please check your Firebase configuration.');
      setLoading(false);
      setMaterials([]);
    }
  }, [user, userData?.class, authLoading]);

  // Filter materials based on search and category
  useEffect(() => {
    let filtered = materials;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(material =>
        material.fileName.toLowerCase().includes(term) ||
        material.uploadedBy.toLowerCase().includes(term) ||
        material.category.toLowerCase().includes(term)
      );
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedCategory]);

  const handleUploadSuccess = () => {
    // Materials will be updated automatically via onSnapshot
    setShowUploadModal(false);
  };

  const handleMaterialUpdate = (materialId, updates) => {
    setMaterials(prev =>
      prev.map(material =>
        material.id === materialId ? { ...material, ...updates } : material
      )
    );
  };

  const handleMaterialDelete = (materialId) => {
    setMaterials(prev => prev.filter(material => material.id !== materialId));
  };

  if (!user || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onUploadClick={() => setShowUploadModal(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.name || user?.displayName}!
          </h1>
          <p className="text-gray-600">
            {userData?.class
              ? `Viewing materials for ${userData.class}`
              : 'Please set your class in profile settings to view materials'
            }
          </p>
        </div>

        {/* Class Warning */}
        {!userData?.class && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Class not set</p>
                <p>Please <button onClick={() => navigate('/profile')} className="underline hover:text-yellow-900">set your class</button> to view and upload materials.</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {userData?.class && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by file name, uploader, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Materials Grid */}
        {userData?.class ? (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      // The useEffect will re-run and retry the query
                    }}
                    className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredMaterials.length > 0 ? (
              <>
                <div className="mb-4 text-gray-600">
                  Showing {filteredMaterials.length} of {materials.length} materials
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials.map((material) => (
                    <FileCard
                      key={material.id}
                      material={material}
                      onUpdate={handleMaterialUpdate}
                      onDelete={handleMaterialDelete}
                    />
                  ))}
                </div>
              </>
            ) : materials.length > 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m-.5-4h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Be the first to upload materials for your class!'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="mt-3 text-blue-600 hover:text-blue-500"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No materials yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Be the first to upload study materials for {userData.class}!
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload Material
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Class Required</h3>
            <p className="mt-1 text-sm text-gray-500">
              You need to set your class in profile settings to access materials.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Profile
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
