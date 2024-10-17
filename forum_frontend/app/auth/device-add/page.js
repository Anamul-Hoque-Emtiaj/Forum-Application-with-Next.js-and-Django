// app/auth/device-add/page.js

"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { getDeviceId } from '../../../utils/device';

const DeviceAdd = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const addDevice = async () => {
      if (status === "authenticated") {
        const deviceId = getDeviceId();

        if (!deviceId) {
          alert('Device ID not found. Please try logging in again.');
          router.push('/auth/login');
          return;
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/add-device/`,
            { device_id: deviceId },
            {
              headers: {
                Authorization: `Token ${session.accessToken}`,
              },
            }
          );
          console.log(response.data.message);
          // Redirect to profile after successful device addition
          router.push('/accounts/profile');
        } catch (error) {
          console.error('Error adding device:', error.response?.data || error.message);
          alert('Failed to add device. Please try logging in again.');
          // Optionally, redirect to an error page or logout
          router.push('/auth/login');
        }
      }
    };

    addDevice();
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Processing your login...</h2>
      </div>
    </div>
  );
};

export default DeviceAdd;
