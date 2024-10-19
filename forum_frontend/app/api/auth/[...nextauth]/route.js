// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        device_id: { label: "Device ID", type: "text" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`, {
            email: credentials.email,
            password: credentials.password,
            device_id: credentials.device_id,
          });

          const user = res.data;

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Forces account selection on each login
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl",
          access_type: "offline", // Necessary to receive a refresh token
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Handle CredentialsProvider
        if (account.provider === "credentials") {
          token.accessToken = user.key;
        }

        // Handle GoogleProvider
        if (account.provider === "google") {
          try {
            // Send Google tokens to Django backend
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/`,
              {
                access_token: account.access_token,
                id_token: account.id_token,
                code: account.code,
              }
            );

            // Store backend access token
            token.accessToken = response.data.key;

            // Store YouTube access and refresh tokens
            token.youtubeAccessToken = account.access_token;
            token.youtubeRefreshToken = account.refresh_token;
            token.youtubeExpiresAt = account.expires_at;
          } catch (error) {
            console.error("Error sending tokens to backend:", error);
            // Optionally, you can set an error flag in the token
            token.error = "BackendTokenError";
          }
        }
      }

      // Token refresh logic for YouTube access token
      if (token.youtubeExpiresAt && Date.now() < token.youtubeExpiresAt * 1000) {
        // YouTube access token is still valid
        return token;
      }

      // YouTube access token has expired, attempt to refresh
      if (token.youtubeRefreshToken) {
        try {
          const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.youtubeRefreshToken,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const refreshedTokens = response.data;

          // Update YouTube access token and expiry time
          token.youtubeAccessToken = refreshedTokens.access_token;
          token.youtubeExpiresAt = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;

          // Update refresh token if a new one is provided
          if (refreshedTokens.refresh_token) {
            token.youtubeRefreshToken = refreshedTokens.refresh_token;
          }

          return token;
        } catch (error) {
          console.error("Error refreshing YouTube access token:", error);

          // If refresh fails, invalidate YouTube tokens in the JWT
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Attach backend access token to the session
      session.accessToken = token.accessToken;

      // Attach YouTube tokens to the session
      session.youtubeAccessToken = token.youtubeAccessToken;
      session.youtubeRefreshToken = token.youtubeRefreshToken;
      session.youtubeExpiresAt = token.youtubeExpiresAt;

      // Attach error if any occurred during token refresh
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
