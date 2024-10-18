'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const useWebSocket = () => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState(null);
  const [newNotification, setNewNotification] = useState(null);

  useEffect(() => {
    if (status === 'loading' || !session) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${window.location.hostname}:8001/ws/notifications/?token=${session.accessToken}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNewNotification(data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [session, status]);

  return { socket, newNotification };
};

export default useWebSocket;
