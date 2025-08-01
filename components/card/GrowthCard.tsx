"use client";

import React, { useRef, useState, useEffect } from "react";
import { GrowthCardData, TwitterUser } from "@/types/index";
import Image from "next/image";
import { YouMindLogo } from "../icon/logo";
import { generateShareUrl, generateTwitterShareUrl } from "@/utils/card-utils";
import { DownloadButton } from "./downloadButton";

interface GrowthCardProps {
  data: GrowthCardData;
  user: TwitterUser;
}

export const GrowthCard = ({ data, user }: GrowthCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    setShareUrl(user.username ? generateShareUrl(user.username) : window.location.href);
  }, [user.username]);

  return (
    <div ref={cardContentRef} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-purple-50 border border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src={user.profile_image_url}
                alt={user.display_name}
                width={48}
                height={48}
                className="rounded-full border-3 border-white shadow-lg ring-2 ring-indigo-200"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.display_name}</h1>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <a
              target="_blank"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
              href={generateTwitterShareUrl(
                { name: user.display_name, analysis: data.summary, id: user.username },
                shareUrl
              )}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share
            </a>
            <DownloadButton cardRef={cardContentRef} fileName={"personalityCard"} />
          </div>
        </div>

        {/* Card Title */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {data.cardTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* Analysis Points */}
        <div className="space-y-6 mb-8">
          {data.points.map((point, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {point.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-semibold opacity-90">深度总结</span>
          </div>
          <p className="text-lg font-bold leading-relaxed">
            {data.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-indigo-200">
          <div className="flex items-center space-x-3">
            <YouMindLogo />
            <div>
              <p className="text-sm font-semibold text-gray-700">Write something good.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
