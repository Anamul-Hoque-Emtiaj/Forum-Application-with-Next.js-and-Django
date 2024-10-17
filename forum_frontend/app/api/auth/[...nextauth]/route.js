import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { parseCookies } from 'nookies';

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
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Check if the account is from Google (OAuth)
      if (account && account.provider === "google") {
        // Send a POST request to your Django backend with Google tokens
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/`,
            {
              access_token: account.access_token,
              id_token: account.id_token,
              code: account.code,
            }
          );

          // Store backend access token or any additional data
          token.accessToken = response.data.key;

        } catch (error) {
          console.error("Error sending tokens to backend:", error);
        }
      }
      else if (user) {       // Handle login via CredentialsProvider
        token.accessToken = user.key;
      }

      return token;
    },

    async session({ session, token }) {
      // Attach the backend access token to the session if it exists
      session.accessToken = token.accessToken;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
