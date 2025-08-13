import React from 'react';
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

