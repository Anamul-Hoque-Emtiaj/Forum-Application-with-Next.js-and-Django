// app/auth/signin/page.js

'use client';

import React, { useState } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/dj-rest-auth/login/', {
        email,
        password,
      });
      localStorage.setItem('authToken', res.data.access_token);
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Invalid credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    // Redirect to the backend endpoint for Google OAuth
    window.location.href = 'http://localhost:8000/api/dj-rest-auth/google/?redirect_uri=http://localhost:3000/auth/google/callback';
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleManualSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      <p>
        Don't have an account? <Link href="/auth/signup">Sign Up</Link>
      </p>
      <p>
        Forgot your password? <Link href="/auth/forgot-password">Reset Password</Link>
      </p>
    </div>
  );
}
