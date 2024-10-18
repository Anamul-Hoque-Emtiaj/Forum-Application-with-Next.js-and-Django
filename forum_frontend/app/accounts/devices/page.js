"use client"; // This makes it a Client Component

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '../../components/common/ProtectedRoute'; // Adjust the import path
import DeviceList from '../../components/DeviceManagement/DeviceList';
import axios from 'axios';

const Devices = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (session) {
      const fetchDevices = async () => {
        try {
          const res1 = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/my-userid/`, {
            headers: {
              Authorization: `Token ${session.accessToken}`,
            },
          });
          const uid = res1.data.uid;
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/user-device/${uid}/`, {
            headers: {
              Authorization: `Token ${session.accessToken}`,
            },
          });
          setDevices(res.data);
        } catch (error) {
          console.error('Error fetching devices:', error);
        }
      };
      fetchDevices();
    }
  }, [session]);


  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-2xl p-8 space-y-4 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-black text-center">Devices</h1>
          <DeviceList devices={devices} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Devices;
