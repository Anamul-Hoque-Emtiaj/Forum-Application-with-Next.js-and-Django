"use client"; // Mark as Client Component

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession(); // Updated to match the new hook format
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading && !session) {
      signIn(); // Redirect to login if not authenticated
    }
  }, [session, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return session ? children : null;
};

export default ProtectedRoute;
