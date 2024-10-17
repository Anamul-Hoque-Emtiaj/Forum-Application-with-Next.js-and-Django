"use client";  // Mark this as a client component

import React from 'react';
import axios from 'axios';
import Link from 'next/link';

const ForgotPassword = () => {
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password/reset/`, {
        email,
      });
      // Inform the user to check their email
      alert('Password reset link sent! Please check your email.');
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Forgot Password error:', error);
      // Handle error (e.g., display error message)
      alert('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
