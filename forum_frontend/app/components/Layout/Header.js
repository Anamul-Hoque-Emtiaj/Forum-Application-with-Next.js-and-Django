"use client"; // Mark as Client Component

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios'; // Import axios
import { getDeviceId } from '../../../utils/device';

const Header = () => {
  const { data: session, status } = useSession(); // Updated to use the new useSession format
  const loading = status === 'loading';

  const handleLogout = async () => {
    if (session?.accessToken) {
      try {
        // Call backend logout endpoint to delete the token
        const device_id = getDeviceId();
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout/`, {device_id}, {
          headers: {
            Authorization: `Token ${session.accessToken}`, // Ensure the token is sent
          },
        });
        console.log("Backend logout successful.");
      } catch (error) {
        console.error("Error logging out from backend:", error.response?.data || error.message);
      }
    }

    // Sign out from NextAuth.js
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyApp
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          {loading ? (
            <div>Loading...</div>
          ) : session ? (
            <>
              <Link href="/accounts/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>
              <Link href="/accounts/devices" className="text-gray-700 hover:text-blue-600">
                Devices
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/auth/signup" className="text-gray-700 hover:text-blue-600">
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
