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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/dj-rest-auth/login/', {
        email,
        password,
      });
      localStorage.setItem('authToken', res.data.access_token);
      router.push('/');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const messages = Object.values(error.response.data).flat();
        setError(messages.join(' '));
      } else {
        setError('Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to the backend endpoint for Google OAuth
    window.location.href = 'http://localhost:8000/api/dj-rest-auth/google/?redirect_uri=http://localhost:3000/auth/google/callback';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Sign In to Your Account</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleManualSignIn} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              }`}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="mx-2 text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
          >
            {/* Google Icon (Using SVG) */}
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              fill="currentColor"
            >
              <path d="M488 261.8C488 403 391 504 248 504 111 504 0 393 0 256S111 8 248 8c66.2 0 123 24.5 166.3 64.9l-67.5 64.9C327.4 150.7 287.8 136 248 136c-84.3 0-153 68.7-153 153s68.7 153 153 153c93.1 0 144.4-72.4 144.4-144.4 0-9.8-.7-19.3-2-28.5H248v-51.5h236c2.9 15.6 4.5 32.3 4.5 51.5z" />
            </svg>
            Sign In with Google
          </button>
        </div>

        {/* Additional Links */}
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Forgot your password?{' '}
          <Link href="/auth/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
}
