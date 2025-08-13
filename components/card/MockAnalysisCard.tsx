'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { NewAnalysisData, TwitterUser } from '../../types/index';
import { getTwitterHighQualityAvatar } from '../../utils/twitterAvatar';
import { YouMindLogo } from '../icon/logo';
import { DownloadButton } from './downloadButton';

interface MockAnalysisCardProps {
  analysisData: NewAnalysisData;
  user: TwitterUser;
}

export const MockAnalysisCard = ({ analysisData, user }: MockAnalysisCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardContentRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Header Section - 响应式布局 */}
        <div className="mb-6">
          {/* 移动端：垂直布局 */}
          <div className="flex flex-col space-y-4 sm:hidden">
            {/* 用户信息行 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={getTwitterHighQualityAvatar(user.profile_image_url) || '/placeholder.svg'}
                    alt={user.display_name}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-white shadow-lg ring-2 ring-blue-200"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-bold text-gray-900 truncate">{user.display_name}</h1>
                </div>
              </div>

              {/* 移动端按钮组 */}
              <div className="flex space-x-2 flex-shrink-0">
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-2 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out ${user.display_name}'s analysis on @YouMind`,
                  )}&url=${encodeURIComponent(
                    `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://growth-ny1y2765u-elemens-projects.vercel.app'}/${user.username}`,
                  )}`}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <title>分享</title>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <DownloadButton cardRef={cardContentRef} fileName={'mockAnalysis'} />
              </div>
            </div>

            {/* 卡片标题行 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-label="AI分析"
                >
                  <title>AI分析</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI分析结果
                </h2>
              </div>
            </div>
          </div>

          {/* 桌面端：水平布局 */}
          <div className="hidden sm:flex sm:justify-between sm:items-start">
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <img
                  src={getTwitterHighQualityAvatar(user.profile_image_url) || '/placeholder.svg'}
                  alt={user.display_name}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white shadow-lg ring-2 ring-blue-200"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">{user.display_name}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-label="AI分析"
                  >
                    <title>AI分析</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AI分析结果
                  </h2>
                </div>
              </div>

              <div className="flex space-x-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out ${user.display_name}'s analysis on @YouMind`,
                  )}&url=${encodeURIComponent(
                    `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://growth-ny1y2765u-elemens-projects.vercel.app'}/${user.username}`,
                  )}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <title>分享</title>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share
                </a>
                <DownloadButton cardRef={cardContentRef} fileName={'mockAnalysis'} />
              </div>
            </div>
          </div>
        </div>

        {/* 分析标题 */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {analysisData.title}
          </h3>
        </div>

        {/* 分析总结 */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-xl p-4 sm:p-5">
            <p className="text-sm sm:text-base text-blue-800 leading-relaxed text-center">
              {analysisData.summary}
            </p>
          </div>
        </div>

        {/* 匹配结果 */}
        <div className="mb-6">
          <div className="bg-white/50 rounded-xl p-4 sm:p-5 border border-blue-100">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
              名人匹配结果
            </h4>
            <div className="space-y-4">
              {analysisData.matches.map((match, index) => (
                <div
                  key={`${match.name}-${match.match_percentage}`}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* 匹配头部 */}
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-lg sm:text-xl font-bold text-gray-800">
                      {match.name}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {match.match_percentage}%
                      </span>
                      <span className="text-sm text-gray-500">匹配度</span>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2">
                    {match.tags.map((tag, tagIndex) => (
                      <span
                        key={`${match.name}-${tag}`}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center mt-6 pt-4 border-t border-blue-200">
          <Link href="https://youmind.ai/overview" target="_blank">
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 sm:w-24 sm:h-4 lg:w-32 lg:h-5">
                <YouMindLogo className="w-full h-full" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
