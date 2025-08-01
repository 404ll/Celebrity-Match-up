"use client";

import React, { useRef } from "react";
import { LaunchCardData, TwitterUser } from "@/types/index";
import { YouMindLogo } from "../icon/logo";
import { generateShareUrl, generateTwitterShareUrl } from "@/utils/card-utils";
import { DownloadButton } from "./downloadButton";
import Link from "next/link";

interface LaunchCardProps {
  data: LaunchCardData;
  user: TwitterUser;
}

export const LaunchCard = ({ data, user }: LaunchCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  console.log("LaunchCard", data);
  return (
    <div
      ref={cardContentRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-green-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.profile_image_url}
                alt={user.display_name}
                width={48}
                height={48}
                className="rounded-full border-3 border-white shadow-lg ring-2 ring-blue-200"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.display_name}</h1>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <a
              target="_blank"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
              href={generateTwitterShareUrl(
                {
                  name: user.display_name,
                  analysis: "1",
                  id: user.username,
                },
                user.username
                  ? generateShareUrl(user.username)
                  : "https://growth-kulpq3oxj-elemens-projects.vercel.app/twitter/" +
                      user.username
              )}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share
            </a>
            <DownloadButton cardRef={cardContentRef} fileName={"mainCard"} />
          </div>
        </div>

        {/* Card Title */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {data.cardTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* 主标题区域 */}
          <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-2xl p-6 shadow-inner">
            <h3 className="text-xl font-bold text-blue-900 leading-relaxed text-center">
              {data.title}
            </h3>
          </div>

          {/* 建议列表 */}
          <div className="space-y-4">
            {data.suggestions.map((item, index) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">
                      {item.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 结束语 */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm font-semibold opacity-90">行动宣言</span>
            </div>
            <p className="text-lg font-bold leading-relaxed">
              {data.closingThought}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-blue-200">
          <div className="flex items-center space-x-3">
            <Link href="https://www.youmind.ai" target="_blank">
              <YouMindLogo />
            </Link>
            <div>
              <p className="text-sm font-semibold text-gray-700">Write something good.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
