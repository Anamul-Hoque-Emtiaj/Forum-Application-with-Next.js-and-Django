// app/components/Navbar.js

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../utils/api'; // Ensure the correct path to your api utility

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/dj-rest-auth/logout/');
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Error logging out.');
    }
  };

  return (
    <nav className="bg-background text-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side - Logo or Home Link */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold hover:text-blue-500 transition-colors duration-200">
              ForumApp
            </Link>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="hidden md:flex md:items-center">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                  Forum
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link href="/user" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/auth/signin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* Mobile menu button can be implemented here if needed */}
            {/* For simplicity, it's omitted in this example */}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Optional */}
      {/* Implement mobile menu dropdown here if you plan to support mobile navigation */}
    </nav>
  );
}
