import { Metadata } from 'next';
import { AIAnalysisResult } from '@/types';
import { getCachedAnalysisKV } from '@/cache/cache';
import { TwitterAnalysisClient } from './TwitterAnalysisClient';
import { mockAnalysisData, mockUser } from '@/mock';

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
  searchParams: Promise<{ section?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CelebrityTasteMatchPage({ params }: PageProps) {
  const { handle } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TwitterAnalysisClient handle={handle} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // // 从Cloudflare KV获取缓存数据
  // const user = await getCachedAnalysisKV(handle);

  
  // if (!user) {
  //   return {
  //     title: 'User Not Found',
  //     description: 'The requested user analysis could not be found.',
  //   };
  // }

  // const name = user.userDetails.display_name || user.userDetails.username || handle;
  // const username = user.userDetails.username || handle;
  // const picture = user.userDetails.profile_image_url || '';
  // const content = '基于你的独特表达方式，我们的AI将为你匹配具有相似品味和个性的公众人物';

  const user = mockUser;
  const name = user.display_name; // 使用 handle 作为默认名称
  const username = user.username;
  const picture = user.profile_image_url; // 暂时不设置头像
  const content = mockAnalysisData.summary || '';
 
  const imageParams = new URLSearchParams();
  imageParams.set('name', name);
  imageParams.set('username', username);
  imageParams.set('picture', picture);
  imageParams.set('content', content);

  console.log('imageParams', imageParams);
  
  const siteUrl =  'http://localhost:3000';
  const ogImageUrl = `${siteUrl}/api/card?${imageParams.toString()}`;
  
  const image = {
    alt: `${name} - YouMind Analysis`,
    url: ogImageUrl,
    width: 1200,
    height: 630,
  };


  return {
    title: `${name} - YouMind Analysis`,
    description: `Check out ${name}'s celebrity taste match analysis on YouMind.`,
    openGraph: {
      title: `${name} - YouMind Analysis`,
      description: `Check out ${name}'s celebrity taste match analysis on YouMind.`,
      type: 'website',
      url: `/${handle}`,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - YouMind Analysis`,
      description: `Check out ${name}'s celebrity taste match analysis on YouMind.`,
      images: [image.url],
    },
    robots: {
      index: false,
      follow: false,
    },
  } satisfies Metadata;
}