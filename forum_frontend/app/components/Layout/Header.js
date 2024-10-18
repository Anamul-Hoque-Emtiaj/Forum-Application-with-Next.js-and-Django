'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { getDeviceId } from '../../../utils/device';
import { useNotifications } from '../../context/NotificationContext';

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const { notifications, unseenCount, markAsSeen } = useNotifications();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    if (session?.accessToken) {
      try {
        const device_id = getDeviceId();
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/logout/`,
          { device_id },
          {
            headers: {
              Authorization: `Token ${session.accessToken}`,
            },
          }
        );
        console.log('Backend logout successful.');
      } catch (error) {
        console.error(
          'Error logging out from backend:',
          error.response?.data || error.message
        );
      }
    }

    signOut({ callbackUrl: '/' });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyApp
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/posts" className="text-gray-700 hover:text-blue-600">
            Posts
          </Link>

          {loading ? (
            <div>Loading...</div>
          ) : session ? (
            <>
              <Link
                href="/accounts/devices"
                className="text-gray-700 hover:text-blue-600"
              >
                Devices
              </Link>
              <Link
                href="/accounts/profile"
                className="text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link>

              {/* Notification Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="relative text-gray-700 hover:text-blue-600"
                >
                  🔔
                  {unseenCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unseenCount}
                    </span>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
                    <div className="p-2 border-b">
                      <span className="font-semibold">Notifications</span>
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <li
                            key={notification.id}
                            className={`px-4 py-2 hover:bg-gray-100 
                              ${!notification.is_seen ? 'bg-gray-50 font-bold' : ''}`}
                          >
                            {/* Conditional Rendering to Ensure href is Defined */}
                            {notification.id ? (
                              <Link href={`/posts/${notification.post}`} className="block">
                                {notification.message}
                              </Link>
                            ) : (
                              <span className="block cursor-pointer text-gray-700">
                                {notification.message}
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">
                          No notifications
                        </li>
                      )}
                    </ul>
                    <div className="p-2 border-t text-center">
                      <Link
                        href="/notifications"
                        className="text-blue-600 hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-gray-700 hover:text-blue-600"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
