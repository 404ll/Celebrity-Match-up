import React from 'react';
import './globals.css';
import { getURL } from '@/lib/config';
import siteMetadata from './metadata';
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
  metadataBase: new URL(getURL()),
  title: {
    template: `%s’s Twitter Personality Analysis by AI Agent`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: 'wordware',
    images: [siteMetadata.socialBanner],
  },
};
