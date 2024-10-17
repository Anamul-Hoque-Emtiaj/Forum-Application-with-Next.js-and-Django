// app/page.js
import Link from 'next/link';
import { getSession } from 'next-auth/react';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
      <div className="mt-4 space-x-4">
        {session ? (
          <>
            <Link href="/accounts/profile" className="px-4 py-2 text-white bg-blue-600 rounded">
              Go to Profile
            </Link>
            <Link href="/accounts/devices" className="px-4 py-2 text-white bg-green-600 rounded">
              Manage Devices
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="px-4 py-2 text-white bg-blue-600 rounded">
              Login
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 text-white bg-green-600 rounded">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
