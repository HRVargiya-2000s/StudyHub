// src/components/Navbar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const classes = [
  'IT-1A', 'IT-1B', 'IT-2A', 'IT-2B', 'IT-3A', 'IT-3B', 'IT-4A', 'IT-4B', 'IT-5A', 'IT-5B',
  'CSE-1A', 'CSE-1B', 'CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 'CSE-4B', 'CSE-5A', 'CSE-5B',
  'ECE-1A', 'ECE-1B', 'ECE-2A', 'ECE-2B', 'ECE-3A', 'ECE-3B', 'ECE-4A', 'ECE-4B',
  'ME-1A', 'ME-1B', 'ME-2A', 'ME-2B', 'ME-3A', 'ME-3B', 'ME-4A', 'ME-4B',
  'CE-1A', 'CE-1B', 'CE-2A', 'CE-2B', 'CE-3A', 'CE-3B', 'CE-4A', 'CE-4B'
];

export default function Navbar({ onUploadClick }) {
  const navigate = useNavigate();
  const { user, userData, logout, updateUserClass } = useAuth();
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClassChange = async (newClass) => {
    try {
      await updateUserClass(newClass);
      setShowClassDropdown(false);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              StudyHub
            </button>
          </div>

          {/* Center - Class Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Class: {userData?.class || 'Select Class'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showClassDropdown && (
                <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {classes.map((className) => (
                    <button
                      key={className}
                      onClick={() => handleClassChange(className)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        userData?.class === className ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {className}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={onUploadClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Upload Material
            </button>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">
                    {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <div className="font-medium text-gray-800">
                  {userData?.name || user?.displayName}
                </div>
                <div className="text-gray-500">
                  {userData?.class || 'No class set'}
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Class Selector & Upload */}
        <div className="md:hidden pb-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-4">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
              >
                <span className="text-sm font-medium text-gray-700">
                  Class: {userData?.class || 'Select Class'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showClassDropdown && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {classes.map((className) => (
                    <button
                      key={className}
                      onClick={() => handleClassChange(className)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        userData?.class === className ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {className}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onUploadClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium text-sm"
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showClassDropdown || showProfileDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowClassDropdown(false);
            setShowProfileDropdown(false);
          }}
        />
      )}
    </nav>
  );
}