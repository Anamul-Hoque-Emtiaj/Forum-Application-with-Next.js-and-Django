"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const ConfirmEmail = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      if (!key) {
        setStatusMessage('Invalid confirmation link.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/auth/registration/verify-email/`, {
          key: key,
        });

        setStatusMessage('Email confirmed successfully! You can now log in.');
      } catch (error) {
        console.error('Error confirming email:', error.response?.data || error.message);
        setStatusMessage('Invalid or expired confirmation link.');
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [key]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-center">Confirming Email...</h1>
          <p className="text-center">Please wait while we confirm your email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center">Email Confirmation</h1>
        <p className="text-center">{statusMessage}</p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
