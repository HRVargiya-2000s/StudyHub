// src/components/FileCard.jsx
import { useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Notes',
  'Lab Manual',
  'Book',
  'Practical File',
  'Notification'
];

export default function FileCard({ material, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newCategory, setNewCategory] = useState(material.category);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.uid === material.uploaderUID;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    window.open(material.fileURL, '_blank');
  };

  const handleView = () => {
    if (material.fileType === 'application/pdf') {
      setShowPreview(true);
    } else {
      window.open(material.fileURL, '_blank');
    }
  };

  const handleEdit = async () => {
    if (!isOwner) return;

    try {
      const materialRef = doc(db, 'materials', material.id);
      await updateDoc(materialRef, {
        category: newCategory
      });
      onUpdate && onUpdate(material.id, { category: newCategory });
      setEditing(false);
    } catch (error) {
      console.error('Error updating material:', error);
      alert('Failed to update material. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'materials', material.id));

      // Delete from Storage
      const storageRef = ref(storage, material.fileURL);
      await deleteObject(storageRef);

      onDelete && onDelete(material.id);
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Notes': 'bg-blue-100 text-blue-800',
      'Lab Manual': 'bg-green-100 text-green-800',
      'Book': 'bg-purple-100 text-purple-800',
      'Practical File': 'bg-orange-100 text-orange-800',
      'Notification': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getFileIcon(material.fileType)}</div>
            <div>
              <h3 className="font-semibold text-gray-800 truncate max-w-xs" title={material.fileName}>
                {material.fileName}
              </h3>
              <p className="text-sm text-gray-500">by {material.uploadedBy}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(material.category)}`}>
            {material.category}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span>Size: {formatFileSize(material.fileSize)}</span>
            <span>{formatDate(material.uploadDate)}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleView}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            View
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Download
          </button>

          {isOwner && (
            <div className="flex space-x-1">
              {editing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-green-500 text-white px-2 py-2 rounded-md text-sm hover:bg-green-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 text-white px-2 py-2 rounded-md text-sm hover:bg-gray-600"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-yellow-500 text-white px-2 py-2 rounded-md text-sm hover:bg-yellow-600"
                >
                  ✏️
                </button>
              )}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 text-white px-2 py-2 rounded-md text-sm hover:bg-red-600 disabled:bg-gray-400"
              >
                {deleting ? '...' : '🗑️'}
              </button>
            </div>
          )}
        </div>

        {editing && (
          <div className="mt-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {showPreview && material.fileType === 'application/pdf' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold truncate">{material.fileName}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-full">
              <iframe
                src={material.fileURL}
                className="w-full h-full border-0"
                title={material.fileName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}