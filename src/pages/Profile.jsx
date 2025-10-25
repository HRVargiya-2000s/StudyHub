// src/pages/Profile.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, userData, updateUserClass, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const classes = [
    'IT-1A', 'IT-1B', 'IT-2A', 'IT-2B', 'IT-3A', 'IT-3B', 'IT-4A', 'IT-4B', 'IT-5A', 'IT-5B',
    'CSE-1A', 'CSE-1B', 'CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 'CSE-4B', 'CSE-5A', 'CSE-5B',
    'ECE-1A', 'ECE-1B', 'ECE-2A', 'ECE-2B', 'ECE-3A', 'ECE-3B', 'ECE-4A', 'ECE-4B',
    'ME-1A', 'ME-1B', 'ME-2A', 'ME-2B', 'ME-3A', 'ME-3B', 'ME-4A', 'ME-4B',
    'CE-1A', 'CE-1B', 'CE-2A', 'CE-2B', 'CE-3A', 'CE-3B', 'CE-4A', 'CE-4B'
  ];

  useEffect(() => {
    if (userData?.class) {
      setSelectedClass(userData.class);
    }
  }, [userData]);

  const handleSaveClass = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserClass(selectedClass);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/home');
      }, 1500);
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center gap-4">
              <img
                src={user?.photoURL || 'https://via.placeholder.com/100'}
                alt={user?.displayName}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user?.displayName}</h1>
                <p className="text-blue-100 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Class Selection Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">-- Choose your class --</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                You can only view and upload materials for your selected class
              </p>
            </div>

            {/* Current Class Info */}
            {userData?.class && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Current Class:</span>{' '}
                  <span className="text-blue-600 font-semibold">{userData.class}</span>
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveClass}
              disabled={isSaving || !selectedClass}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Class'}
            </button>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-700 font-medium">Class updated successfully!</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* User Info Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="text-sm font-medium text-gray-900">{userData?.class || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        {userData?.class && (
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Materials</p>
                  <p className="text-xs text-gray-500">Browse study materials</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Upload Material</p>
                  <p className="text-xs text-gray-500">Share study resources</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
