// app/auth/signup/page.js
"use client";
import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import OAuthButton from '../../components/Auth/OAuthButton';
import SignupForm from '../../components/Auth/SignupForm';
import { signIn } from 'next-auth/react'; 
import { getDeviceId } from '../../../utils/device';

const Signup = () => {
  const handleSignup = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password1 = e.target.password1.value;
    const password2 = e.target.password2.value;
    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/`, {
        username,
        email,
        password1,
        password2,
        first_name,
        last_name,
      });
      alert('Signup successful! Please verify your email before logging in.');
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/auth/device-add' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Signup</h2>
        <SignupForm onSubmit={handleSignup} />
        <OAuthButton onClick={handleGoogleLogin} provider="Google" />
        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
