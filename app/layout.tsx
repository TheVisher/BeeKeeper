import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
// Fix: Import React to resolve 'React.ReactNode' type error.
import React from 'react';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Capture Card Recall',
  description: 'A modern bookmarking app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
          <body
            className={cn(
              'min-h-screen bg-background font-sans antialiased',
              inter.variable
            )}
          >
            <SessionProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SessionProvider>
          </body>
    </html>
  );
}