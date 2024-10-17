// app/auth/login/page.js
"use client";
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import OAuthButton from '../../components/Auth/OAuthButton';
import LoginForm from '../../components/Auth/LoginForm';
import { getDeviceId } from '../../../utils/device';

const Login = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [deviceId, setDeviceId] = useState('');

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const device_id = getDeviceId();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      device_id, // Include the device ID in the sign-in request
    });

    if (res.error) {
      // Handle error (e.g., display error message)
      console.error('Login error:', res.error);
      alert('Login failed. Please check your credentials.');
    } else {
      // Redirect to profile or desired page
      window.location.href = '/accounts/profile';
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/auth/device-add' });

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <LoginForm onSubmit={handleCredentialsLogin} />
        <OAuthButton onClick={handleGoogleLogin} provider="Google" />
        <div className="flex justify-between mt-4">
          <Link href="/auth/signup" className="text-sm text-blue-600 hover:underline">
            Don't have an account? Sign up
          </Link>
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
