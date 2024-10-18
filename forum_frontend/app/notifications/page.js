'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useNotifications } from '../context/NotificationContext';
import { useSession } from 'next-auth/react';

const NotificationsPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const { markAsSeen } = useNotifications();
  const [allNotifications, setAllNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchAllNotifications = async () => {
      setLoadingPage(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/notifications/?page=${page}`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        });
        console.log('Fetched Notifications:', res.data.results); // For debugging
        setAllNotifications(res.data.results);
        setHasNext(res.data.next !== null);
        setHasPrev(res.data.previous !== null);
      } catch (error) {
        console.error('Error fetching notifications:', error.response?.data || error.message);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchAllNotifications();
  }, [session, page]);

  const handlePagination = (direction) => {
    if (direction === 'next' && hasNext) setPage(prev => prev + 1);
    if (direction === 'prev' && hasPrev) setPage(prev => prev - 1);
  };

  const handleNotificationClick = async (id) => {
    await markAsSeen(id);
    // Optimistically update the notification's `is_seen` status
    setAllNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, is_seen: true } : notification
      )
    );
  };

  if (loading || loadingPage) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!session) {
    return <div className="container mx-auto p-4">Please log in to view notifications.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul>
        {allNotifications.length > 0 ? (
          allNotifications.map(notification => (
            <li key={notification.id} className={`p-4 border-b ${!notification.is_seen ? 'bg-gray-50' : ''}`}>
              <Link 
                  href={`posts/${notification.post}`}
                  className="block"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-center">
                    <span>{notification.message}</span>
                    <span className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
                  </div>
                </Link>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No notifications found.</li>
        )}
      </ul>
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => handlePagination('prev')} 
          disabled={!hasPrev}
          className={`px-4 py-2 bg-blue-600 text-white rounded ${!hasPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          Previous
        </button>
        <button 
          onClick={() => handlePagination('next')} 
          disabled={!hasNext}
          className={`px-4 py-2 bg-blue-600 text-white rounded ${!hasNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
