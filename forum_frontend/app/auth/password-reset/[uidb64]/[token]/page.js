"use client"; // Ensure this is a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PasswordResetConfirm = ({ params }) => {
  const { uidb64, token } = params; // Extracted from the URL
  const router = useRouter();

  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordResetConfirm = async (e) => {
    e.preventDefault();

    if (newPassword1 !== newPassword2) {
      setStatusMessage('Passwords do not match.');
      return;
    }

    if (newPassword1.length < 8) { // Example validation
      setStatusMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/password/reset/confirm/${uidb64}/${token}/`;
      const response = await axios.post(endpoint, {
        new_password1: newPassword1,
        new_password2: newPassword2,
        token: token,
        uid: uidb64,
      });

      setStatusMessage('Password reset successful! You can now log in with your new password.');

      // Optionally, redirect to login page after a delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error.response?.data || error.message);
      // Extract specific error messages if available
      if (error.response && error.response.data) {
        const errorKeys = Object.keys(error.response.data);
        if (errorKeys.length > 0) {
          setStatusMessage(error.response.data[errorKeys[0]][0]);
        } else {
          setStatusMessage('Failed to reset password. Please try again.');
        }
      } else {
        setStatusMessage('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If uidb64 or token is missing, show an error
  if (!uidb64 || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-center">Password Reset</h1>
          <p className="text-center text-red-600">Invalid password reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handlePasswordResetConfirm} className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
        <div>
          <label htmlFor="newPassword1" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword1"
            name="newPassword1"
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border rounded"
            minLength={8}
          />
        </div>
        <div>
          <label htmlFor="newPassword2" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            id="newPassword2"
            name="newPassword2"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border rounded"
            minLength={8}
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
        {statusMessage && (
          <p className={`text-center ${statusMessage.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default PasswordResetConfirm;
