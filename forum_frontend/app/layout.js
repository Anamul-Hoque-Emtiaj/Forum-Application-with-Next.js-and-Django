'use client';

import { SessionProvider } from "next-auth/react";
import './globals.css';
import Header from './components/Layout/Header';
import { NotificationProvider } from './context/NotificationContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NotificationProvider>
            <Header />
            {children}
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
