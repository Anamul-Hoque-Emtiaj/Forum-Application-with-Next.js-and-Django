// app/user/page.js

'use client';

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await api.get('/dj-rest-auth/user/');
      setUser(res.data);
    } catch (error) {
      console.error(error);
      alert('Please log in.');
      window.location.href = '/auth/signin';
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        {/* Add more user info as needed */}
        {/* Example for more user information */}
        {/* <p className="text-lg mb-2">
          <strong>Username:</strong> {user.username}
        </p> */}
        {/* <p className="text-lg mb-2">
          <strong>Join Date:</strong> {new Date(user.date_joined).toLocaleDateString()}
        </p> */}
      </div>
    </div>
  );
}
