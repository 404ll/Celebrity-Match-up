'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { TasteProfileData, TwitterUser } from '../../types/index';
import { getTwitterHighQualityAvatar } from '../../utils/twitterAvatar';
import { YouMindLogo } from '../icon/logo';
import { DownloadButton } from './downloadButton';

// // 名人信息数据库
// const celebrityInfo: Record<string, string> = {

// };

// 获取名人信息的函数
function getCelebrityInfo(name: string): string {
  if (!name) return '正在分析中...';
  return `${name} - 知名人物，详细信息正在完善中...`;
}

interface TasteProfileCardProps {
  analysisData: TasteProfileData;
  user: TwitterUser;
}

export const TasteProfileCard = ({ analysisData, user }: TasteProfileCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardContentRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-purple-50 to-pink-50 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Header Section - 重新设计的响应式布局 */}
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
                    className="rounded-full border-2 border-white shadow-lg ring-2 ring-purple-200"
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
                  className="inline-flex items-center px-2 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  rel="noreferrer"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <DownloadButton cardRef={cardContentRef} fileName={'soulMatch'} />
              </div>
            </div>

            {/* 卡片标题行 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  品味画像
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    品味画像
                  </h2>
                </div>
              </div>

              <div className="flex space-x-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out ${user.display_name}'s analysis on @YouMind`,
                  )}&url=${encodeURIComponent(
                    `https://growth-atu2pqc22-elemens-projects.vercel.app/${user.display_name}?section=SoulFormula`,
                  )}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share
                </a>
                <DownloadButton cardRef={cardContentRef} fileName={'soulMatch'} />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        {analysisData.tagline && (
          <div className="mb-5">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl p-3 sm:p-4">
              <p className="text-sm sm:text-base font-medium text-purple-800 leading-relaxed text-center italic">
                "{analysisData.tagline}"
              </p>
            </div>
          </div>
        )}

        {/* Soul Composition Analysis - 改为文字列表 */}
        {analysisData.matches && analysisData.matches.length > 0 && (
          <div className="mb-6">
            <div className="bg-white/50 rounded-xl p-4 sm:p-5 border border-purple-100">
              <div className="space-y-3">
                {analysisData.matches.map((match, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
                  >
                    {/* 百分比圆圈 */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-md">
                      {match.percentage || 0}%
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* 名字 */}
                        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {match.name || '正在分析中'}
                        </h4>

                        <div className="relative group">
                          <svg
                            className="w-4 h-4 text-gray-400 hover:text-purple-500 transition-colors duration-200 cursor-pointer"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                          </svg>

                          {/* 优化后的 Tooltip */}
                          <div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3
                             px-6 py-4 bg-white text-gray-800 text-sm leading-relaxed
                             rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 
                             group-hover:scale-100 scale-95 transition-all duration-300 
                             pointer-events-none z-20 min-w-[300px] max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] 
                             max-h-[300px] overflow-y-auto text-left border border-gray-200"
                          >
                            {/* 姓名标题 */}
                            <div className="font-semibold text-purple-600 mb-2 text-base">
                              {match.name}
                            </div>

                            {/* 身份介绍正文 */}
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {match.identity_intro}
                            </div>

                            {/* 箭头 */}
                            <div
                              className="absolute top-full left-1/2 transform -translate-x-1/2 
                             w-3 h-3 bg-white rotate-45 shadow-md z-[-1] 
                             border-r border-b border-gray-200"
                            />
                          </div>
                        </div>

                        {/* 核心品味 */}
                        <span className="text-xs sm:text-sm text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                          {match.coreTaste || '正在分析中'}
                        </span>
                      </div>

                      {/* 分析解释文本 */}
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {match.explanation || '正在分析中...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Final Identity */}
        {analysisData.finalIdentity && analysisData.finalIdentity.title && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 sm:p-5 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-xs sm:text-sm font-semibold opacity-90">
                {analysisData.finalIdentity.title}
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              {analysisData.finalIdentity.identity || '正在分析中...'}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center mt-4 pt-3 border-t border-purple-200">
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
