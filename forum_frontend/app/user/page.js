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

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      {/* Add more user info as needed */}
    </div>
  );
}
