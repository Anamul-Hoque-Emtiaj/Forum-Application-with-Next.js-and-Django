"use client";

import { SessionProvider } from "next-auth/react";
import './globals.css';
import Header from './components/Layout/Header'; // Correct import path

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header /> {/* Header now wrapped by SessionProvider */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
