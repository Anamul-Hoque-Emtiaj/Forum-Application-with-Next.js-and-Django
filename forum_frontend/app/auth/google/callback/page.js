// app/auth/google/callback/page.js

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import api from '../../../../utils/api';

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get('access_token');
    const refreshToken = query.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      router.push('/');
    } else {
      alert('Authentication failed.');
      router.push('/auth/signin');
    }
  }, [router]);

  return <div>Loading...</div>;
}
