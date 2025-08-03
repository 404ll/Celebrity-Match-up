"use client";

import { useRef, useState, useEffect } from "react";
import type { LaunchCardData, TwitterUser } from "@/types/index";
import { YouMindLogo } from "../icon/logo";
import { DownloadButton } from "./downloadButton";
import Link from "next/link";
import Image from "next/image";

interface LaunchCardProps {
  data: LaunchCardData;
  user: TwitterUser;
}

export const LaunchCard = ({ data, user }: LaunchCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);


  return (
    <div
      ref={cardContentRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-green-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Header Section - 重新设计的响应式布局 */}
        <div className="mb-6">
          {/* 移动端：垂直布局 */}
          <div className="flex flex-col space-y-4 sm:hidden">
            {/* 用户信息行 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <Image
                    src={user.profile_image_url || "/placeholder.svg"}
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
                  className="inline-flex items-center px-2 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                 
                  rel="noreferrer"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <DownloadButton cardRef={cardContentRef} fileName={"launchCard"} />
              </div>
            </div>

            {/* 卡片标题行 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {data.cardTitle}
                </h2>
              </div>
            </div>
          </div>

          {/* 桌面端：水平布局 */}
          <div className="hidden sm:flex sm:justify-between sm:items-start">
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <Image
                  src={user.profile_image_url || "/placeholder.svg"}
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {data.cardTitle}
                  </h2>
                </div>
              </div>

              <div className="flex space-x-3">
                <a
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
                 
                  rel="noreferrer"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share
                </a>
                <DownloadButton cardRef={cardContentRef} fileName={"launchCard"} />
              </div>
            </div>
          </div>
        </div>
        

        {/* Main Title */}
        <div className="mb-5">
          <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-xl p-3 sm:p-4 shadow-inner">
            <h3 className="text-base sm:text-lg font-bold text-blue-800 leading-relaxed text-center">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Suggestions - 改为文字列表 */}
        <div className="mb-6">
          <div className="bg-white/50 rounded-xl p-4 sm:p-5 border border-blue-100">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
              建议方案
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {data.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {suggestion.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing Thought */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-4 sm:p-5 text-white shadow-lg">
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-xs sm:text-sm font-semibold opacity-90">
              Closing Thought
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            {data.closingThought}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center mt-4 pt-3 border-t border-blue-200">
          <Link href="https://youmind.ai/overview" target="_blank">
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 sm:w-24 sm:h-4 lg:w-32 lg:h-6">
                <YouMindLogo className="w-full h-full" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
