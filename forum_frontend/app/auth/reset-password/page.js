// app/auth/reset-password/page.js

'use client';

import React, { useState } from 'react';
import api from '../../../utils/api';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      alert('Passwords do not match.');
      return;
    }
    try {
      await api.post('/dj-rest-auth/password/reset/confirm/', {
        uid,
        token,
        new_password1: password1,
        new_password2: password2,
      });
      setMessage('Password reset successful.');
    } catch (error) {
      console.error(error);
      setMessage('Error resetting password.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="New Password"
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
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
