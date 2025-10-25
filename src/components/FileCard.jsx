// src/components/FileCard.jsx

import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useState } from 'react';

export default function FileCard({ material }) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user && material.uploaderUID === user.uid;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    setIsDeleting(true);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'materials', material.id));
      // Delete from Storage
      if (material.fileURL) {
        const fileRef = ref(storage, material.fileURL);
        await deleteObject(fileRef);
      }
    } catch (error) {
      alert('Failed to delete material.');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = material.uploadDate?.toDate
    ? material.uploadDate.toDate().toLocaleString()
    : new Date(material.uploadDate).toLocaleString();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md overflow-hidden relative flex flex-col">
      {/* File info */}
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="inline-block px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600 font-medium">
            {material.category}
          </span>
          {isOwner && (
            <span className="inline-block text-xs bg-green-100 text-green-600 rounded-lg px-2 py-0.5 font-medium">
              You
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{material.fileName}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>Uploaded by:</span>
          <span className="text-blue-700 font-medium">{material.uploadedBy}</span>
        </div>
        <div className="text-xs text-gray-400 mb-2">
          {formattedDate}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 border-t px-5 py-3 bg-gray-50">
        <a
          href={material.fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
          title="View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 12 2s10 4.477 10 10z" />
          </svg>
          View
        </a>
        <a
          href={material.fileURL}
          download
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
          title="Download"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
          Download
        </a>
        {isOwner && (
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
}
