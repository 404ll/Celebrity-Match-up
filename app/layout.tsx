import React from 'react';
// import { NextI18nProvider } from '../i18n/factory';
import './globals.css';
export const revalidate = 604800; // 7天
export const dynamic = 'force-static';

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: 'YouMind - Celebrity Taste Match',
  description:
    'Based on your unique way of expressing yourself, our AI will match you with public figures who share a similar sense of taste and personality.',
};
