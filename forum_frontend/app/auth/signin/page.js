// app/auth/signin/page.js

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/providers");
      const data = await res.json();
      setProviders(data);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: true,
      callbackUrl,
    });

    // Handle errors or success as needed
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              required
            />
          </label>
        </div>
        <button type="submit">Sign In</button>
      </form>

      <hr />

      {providers &&
        Object.values(providers).map((provider) => {
          if (provider.id === "credentials") {
            return null;
          }
          return (
            <div key={provider.name}>
              <button
                onClick={() =>
                  signIn(provider.id, { callbackUrl })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          );
        })}

      <p>
        Don't have an account? <a href="/auth/signup">Sign Up</a>
      </p>
    </div>
  );
}
