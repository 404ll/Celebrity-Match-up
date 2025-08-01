"use client";

import React, { useRef, useState, useEffect } from "react";
import { SoulFormulaData, TwitterUser } from "@/types/index";
import Image from "next/image";
import { YouMindLogo, YouMindLogoWithText } from "../icon/logo";
import { generateShareUrl, generateTwitterShareUrl } from "@/utils/card-utils";
import { DownloadButton } from "./downloadButton";
import Link from "next/link";

interface SoulFormulaCardProps {
  analysisData: SoulFormulaData;
  user: TwitterUser;
}

export const SoulFormulaCard = ({
  analysisData,
  user,
}: SoulFormulaCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(
      user.username ? generateShareUrl(user.username) : window.location.href
    );
  }, [user.username]);

  return (
    <div
      ref={cardContentRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-purple-50 to-pink-50 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Image
                src={user.profile_image_url}
                alt={user.display_name}
                width={48}
                height={48}
                className="rounded-full border-3 border-white shadow-lg ring-2 ring-purple-200"
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="sm:text-2xl text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {analysisData.cardTitle}
              </h2>
            </div>
          </div>

          <div className="flex space-x-2">
            <a
              target="_blank"
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              href={generateTwitterShareUrl(
                {
                  name: user.display_name,
                  analysis: analysisData.finalIdentity.identity,
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
            <DownloadButton cardRef={cardContentRef} fileName={"soulMatch"} />
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-6">
          <p className="sm:text-lg text-sm font-medium text-purple-800 leading-relaxed text-center">
            "{analysisData.tagline}"
          </p>
        </div>

        {/* Soul Composition Analysis */}
        <div className="mb-6">
          <div className="space-y-4">
            {analysisData.matches.map((match, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {match.percentage}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 sm:text-lg text-base">
                          {match.name}
                        </h4>
                        <span className="text-xs sm:text-sm text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full font-medium">
                          {match.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed sm:text-base text-sm">
                  {match.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Identity */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-xs sm:text-sm font-semibold opacity-90">
              {analysisData.finalIdentity.title}
            </span>
          </div>
          <p className="sm:text-lg text-md font-bold leading-relaxed">
            {analysisData.finalIdentity.identity}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-200">
          <div className="flex items-center space-x-2">
            <Link href="https://youmind.ai/overview" target="_blank">
              <div className="flex items-center gap-2">
                <div className="w-20 h-3 md:w-32 md:h-5">
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
