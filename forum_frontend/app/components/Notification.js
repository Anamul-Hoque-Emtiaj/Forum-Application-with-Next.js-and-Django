// app/components/Notification.js

'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const socket = io('http://localhost:8000', {
      path: '/ws/notifications/',
      transports: ['websocket'],
      query: { token },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server.');
    });

    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
      <h4 className="text-lg font-semibold mb-2">Notifications</h4>
      {notifications.map((notif, index) => (
        <div key={index} className="bg-gray-100 p-2 rounded mb-2">
          <p className="text-gray-800">{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
