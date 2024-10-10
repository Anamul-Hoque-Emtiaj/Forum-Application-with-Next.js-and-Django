// app/auth/signup/page.js

'use client';

import React, { useState } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      alert('Passwords do not match.');
      return;
    }
    try {
      await api.post('/dj-rest-auth/registration/', {
        email,
        password1,
        password2,
      });
      alert('Registration successful. Please check your email to verify your account.');
      router.push('/auth/signin');
    } catch (error) {
      console.error(error);
      alert('Error registering.');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
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
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link href="/auth/signin">Sign In</Link>
      </p>
    </div>
  );
}
