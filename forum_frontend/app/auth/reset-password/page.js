// app/auth/reset-password/page.js

'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../../utils/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dj-rest-auth/password/reset/confirm/', {
        uid,
        token,
        new_password1: password,
        new_password2: confirmPassword,
      });
      alert('Password reset successful. You can now log in.');
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {/* Form for resetting password */}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
