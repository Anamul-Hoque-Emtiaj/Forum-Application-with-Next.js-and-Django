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
    <div className="notifications">
      <h4>Notifications</h4>
      {notifications.map((notif, index) => (
        <div key={index}>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
