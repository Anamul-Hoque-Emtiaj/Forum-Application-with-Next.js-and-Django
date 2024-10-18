'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import useWebSocket from '../hooks/useWebSocket';
import { useSession } from 'next-auth/react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  
  const { newNotification } = useWebSocket();

  useEffect(() => {
    if (!session) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/notifications/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        });
        setNotifications(res.data.results);
        const count = res.data.results.filter(n => !n.is_seen).length;
        setUnseenCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error.response?.data || error.message);
      }
    };

    fetchNotifications();
  }, [session]);

  useEffect(() => {
    if (newNotification) {
      setNotifications(prev => [newNotification, ...prev]);
      setUnseenCount(prev => prev + 1);
    }
  }, [newNotification]);

  const markAllAsSeen = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/notifications/mark_all_seen/`, {}, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      });
      setUnseenCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_seen: true })));
    } catch (error) {
      console.error('Error marking notifications as seen:', error.response?.data || error.message);
    }
  };

  const markAsSeen = async (id) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/notifications/${id}/seen/`, {}, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_seen: true } : n));
      setUnseenCount(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error marking notification as seen:', error.response?.data || error.message);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unseenCount, markAllAsSeen, markAsSeen }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
