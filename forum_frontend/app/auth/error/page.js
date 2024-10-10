// app/auth/error/page.js

'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  );
}
