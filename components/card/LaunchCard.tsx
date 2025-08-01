"use client";

import React, { useRef, useState, useEffect } from "react";
import { LaunchCardData, TwitterUser } from "@/types/index";
import { YouMindLogo, YouMindLogoWithText } from "../icon/logo";
import { generateShareUrl, generateTwitterShareUrl } from "@/utils/card-utils";
import { DownloadButton } from "./downloadButton";
import Link from "next/link";
import Image from "next/image";

interface LaunchCardProps {
  data: LaunchCardData;
  user: TwitterUser;
}

export const LaunchCard = ({ data, user }: LaunchCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(
      user.username ? generateShareUrl(user.username) : window.location.href
    );
  }, [user.username]);

  console.log("LaunchCard", data);
  return (
    <div
      ref={cardContentRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-green-50 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Image
                src={user.profile_image_url}
                alt={user.display_name}
                width={48}
                height={48}
                className="rounded-full border-3 border-white shadow-lg ring-2 ring-blue-200"
              />
            </div>
            <div>
              <h1 className="sm:text-xl text-sm font-bold text-gray-900 sm:block hidden">
                {user.display_name}
              </h1>
            </div>
          </div>

          {/* Card Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="sm:text-2xl text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {data.cardTitle}
              </h2>
            </div>
          </div>

          <div className="flex space-x-2 sm:space-x-3">
            <a
              target="_blank"
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
              href={generateTwitterShareUrl(
                {
                  name: user.display_name,
                  analysis: data.title,
                  id: user.username,
                },
                shareUrl
              )}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share
            </a>
            <DownloadButton cardRef={cardContentRef} fileName={"launchCard"} />
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-2xl p-2 sm:p-4 shadow-inner">
            <h3 className="sm:text-xl text-lg font-bold text-blue-800 leading-relaxed text-center">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mb-4">
          <div className="space-y-2">
            {data.suggestions.map((suggestion, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 sm:text-lg text-base mb-2">
                        {suggestion.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed sm:text-base text-sm">
                        {suggestion.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Thought */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-2 sm:p-4 text-white shadow-lg">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-xs sm:text-sm font-semibold opacity-90">
              Closing Thought
            </span>
          </div>
          <p className="sm:text-lg text-md font-bold leading-relaxed">
            {data.closingThought}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-blue-200">
          <div className="flex items-center space-x-2">
            <Link href="https://youmind.ai/overview" target="_blank">
              <div className="flex items-center gap-2">
                <div className="w-24 h-4 md:w-32 md:h-6">
                  <YouMindLogo className="w-full h-full" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
