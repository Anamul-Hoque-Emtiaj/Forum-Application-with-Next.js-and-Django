// app/components/Navbar.js

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/posts">Forum</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link href="/user">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link href="/auth/signin">Sign In</Link></li>
        )}
      </ul>
    </nav>
  );
}
