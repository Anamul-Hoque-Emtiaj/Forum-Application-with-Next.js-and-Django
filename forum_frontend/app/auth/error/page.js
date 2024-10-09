// app/auth/error/page.js

"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error}</p>
      <a href="/auth/signin">Go back to Sign In</a>
    </div>
  );
}
