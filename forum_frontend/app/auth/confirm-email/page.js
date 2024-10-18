"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct hook for App Router
import axios from 'axios';

const ConfirmEmail = () => {
  const router = useRouter(); // Correct hook for App Router
  const [key, setKey] = useState(null); // State to store the confirmation key
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure the code runs on the client side
    const searchParams = new URL(window.location.href).searchParams;
    const keyFromUrl = searchParams.get('key');
    setKey(keyFromUrl);

    if (keyFromUrl) {
      const confirmEmailNow = async () => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/registration/verify-email/`, {
            key: keyFromUrl,
          });
          setStatusMessage(response.data.message); // Show success message
        } catch (error) {
          setStatusMessage('Invalid or expired confirmation link.');
        } finally {
          setIsLoading(false);
        }
      };
      confirmEmailNow();
    }
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
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
