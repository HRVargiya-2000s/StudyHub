// src/pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const classes = [
  'IT-1A', 'IT-1B', 'IT-2A', 'IT-2B', 'IT-3A', 'IT-3B', 'IT-4A', 'IT-4B', 'IT-5A', 'IT-5B',
  'CSE-1A', 'CSE-1B', 'CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 'CSE-4B', 'CSE-5A', 'CSE-5B',
  'ECE-1A', 'ECE-1B', 'ECE-2A', 'ECE-2B', 'ECE-3A', 'ECE-3B', 'ECE-4A', 'ECE-4B',
  'ME-1A', 'ME-1B', 'ME-2A', 'ME-2B', 'ME-3A', 'ME-3B', 'ME-4A', 'ME-4B',
  'CE-1A', 'CE-1B', 'CE-2A', 'CE-2B', 'CE-3A', 'CE-3B', 'CE-4A', 'CE-4B'
];

export default function Profile() {
  const { user, userData, updateUserClass } = useAuth();
  const [selectedClass, setSelectedClass] = useState(userData?.class || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveClass = async () => {
    if (!selectedClass) {
      setMessage('Please select a class');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await updateUserClass(selectedClass);
      setMessage('Class updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating class:', error);
      setMessage('Failed to update class. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

          {/* User Info Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">User Information</h2>
            <div className="flex items-center space-x-4 mb-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xl">
                    {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {userData?.name || user?.displayName}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Class Selection Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Class Settings</h2>
            <p className="text-gray-600 mb-4">
              Select your class to view and upload materials specific to your group.
              You'll only see materials uploaded by students in the same class.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Class: <span className="font-bold text-blue-600">{userData?.class || 'Not set'}</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your class</option>
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveClass}
                disabled={saving || selectedClass === userData?.class}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Class'}
              </button>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                message.includes('successfully')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Account Created:</strong> {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Unknown'}</p>
              <p><strong>Last Login:</strong> {userData?.lastLogin ? new Date(userData.lastLogin.toDate()).toLocaleDateString() : 'Unknown'}</p>
              <p><strong>User ID:</strong> {user?.uid}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">How StudyHub Works</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">1.</span>
                <p>Set your class above to access class-specific materials.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">2.</span>
                <p>Upload study materials (PDFs, documents, images) with appropriate categories.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">3.</span>
                <p>All students in your class can view and download materials.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">4.</span>
                <p>Only you can edit or delete materials you've uploaded.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}