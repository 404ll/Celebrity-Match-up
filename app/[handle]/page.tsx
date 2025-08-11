import { Metadata } from 'next';
import { AIAnalysisResult } from '@/types';
import { getCachedAnalysisKV } from '@/cache/cache';
import { TwitterAnalysisClient } from './TwitterAnalysisClient';

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
  searchParams: Promise<{ section?: string }>;
}

export default async function CelebrityTasteMatchPage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const { section } = await searchParams;
  console.log('Node_env', process.env.NODE_ENV);
  // // 从Cloudflare KV获取缓存数据
  // const user = await getCachedAnalysisKV(handle);

  // if (!user) {
  //   // 如果没有缓存数据，返回404
  //   notFound();
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TwitterAnalysisClient handle={handle} />
    </div>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { handle } = await params;
  const { section: sectionParam } = await searchParams;

  // 从Cloudflare KV获取缓存数据
  const user = await getCachedAnalysisKV(handle);

  if (!user) {
    return {
      title: 'User Not Found',
      description: 'The requested user analysis could not be found.',
    };
  }

  const name = user.userDetails.display_name || user.userDetails.username || handle;
  const username = user.userDetails.username || handle;
  const picture = user.userDetails.profile_image_url || '';
  const section = (sectionParam || 'TasteProfile') as keyof AIAnalysisResult;
  const content = user.analysis?.[section];

  const imageParams = new URLSearchParams();
  imageParams.set('name', name);
  imageParams.set('username', username);
  imageParams.set('picture', picture);
  imageParams.set('section', String(section));
  imageParams.set('content', typeof content === 'string' ? content : JSON.stringify(content ?? ''));

  const image = {
    alt: `${name} — ${String(section)}`,
    url: `/api/card?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  };

  return {
    title: `${name}`,
    description: `Check out ${name}'s analysis.`,
    openGraph: {
      url: section
        ? `/campaign/celebrity-taste-match/${handle}?section=${section}`
        : `/campaign/celebrity-taste-match/${handle}`,
      images: image,
    },
    twitter: {
      description: `Check out ${name}'s analysis.`,
      images: image,
    },
    robots: {
      index: false,
      follow: false,
    },
  } satisfies Metadata;
}
