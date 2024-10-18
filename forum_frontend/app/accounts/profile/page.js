"use client"; // This makes it a Client Component

import React, { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import ProtectedRoute from '../../components/common/ProtectedRoute'; // Adjust path
import UserProfile from '../../components/User/UserProfile';
import axios from 'axios';

const Profile = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession(); // Ensure you have the latest session
      if (session && session.accessToken) {
        const fetchProfile = async () => {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/user-details/`, {
              headers: {
                Authorization: `Token ${session.accessToken}`,
              },
            });
            setProfile(res.data);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        };
        fetchProfile();
      } else {
        console.error('Access token missing from session');
      }
    };

    fetchSession();
  }, []);

  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/profile/`, updatedData, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      });
      setProfile(res.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-center">My Profile</h1>
          {profile ? (
            <UserProfile profile={profile} onUpdate={handleUpdate} />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
