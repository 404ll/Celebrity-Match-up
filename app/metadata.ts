import { getURL } from '@/lib/config'

export const siteMetadata = {
  title: 'YouMind - Celebrity Taste Match',
  author: 'YouMind',
  headerTitle: 'YouMind',
  description:
    'Based on your unique way of expressing yourself, our AI will match you with public figures who share a similar sense of taste and personality.',
  // dynamic twitter description
  twitter: (username?: string) =>
    username
      ? `Check out ${username}'s celebrity taste match analysis! Discover your unique personality and find famous figures who share your style. Built with AI.`
      : 'AI-powered celebrity taste match analysis that reveals your unique personality and matches you with famous figures who share your style.',
  language: 'en-us',
  theme: 'light',
  siteUrl: new URL(getURL()),
  socialBanner: '/cover.png',
  locale: 'en-US',
}

// If you need a default export as well:
export default siteMetadata 