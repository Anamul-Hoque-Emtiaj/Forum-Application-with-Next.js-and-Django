// app/components/Navbar.js

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav>
      <Link href="/">Home</Link>{" "}
      <Link href="/posts">Posts</Link>{" "}
      {session ? (
        <>
          <Link href="/user">Profile</Link>{" "}
          <button onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </button>
        </>
      ) : (
        <Link href="/auth/signin">Sign In</Link>
      )}
    </nav>
  );
}
