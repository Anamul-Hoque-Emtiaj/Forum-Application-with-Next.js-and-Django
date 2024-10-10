// app/auth/forgot-password/page.js

'use client';

import React, { useState } from 'react';
import api from '../../../utils/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dj-rest-auth/password/reset/', {
        email,
      });
      setMessage('Password reset link sent to your email.');
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset link.');
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
