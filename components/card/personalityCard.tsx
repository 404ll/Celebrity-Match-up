"use client";

import React, { useRef, useState, useEffect } from "react";
import { DeepDiveData, TwitterUser } from "@/types/index";
import Image from "next/image";
import { YouMindLogo } from "../icon/logo";
import { generateShareUrl, generateTwitterShareUrl } from "@/utils/card-utils";
import { DownloadButton } from "./downloadButton";

interface PersonalityCardProps {
  data: DeepDiveData;
  user: TwitterUser;
}

export const PersonalityCard = ({ data, user }: PersonalityCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    // 在客户端设置shareUrl
    setShareUrl(user.username ? generateShareUrl(user.username) : window.location.href);
  }, [user.username]);
  console.log("personalityCard", data);
  return (
    <div ref={cardContentRef} className="text-card-foreground shadow-lg overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300">
      <div  className="flex flex-col p-8 text-black">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-start mb-6">
          <div className="flex items-center">
            <Image
              src={user.profile_image_url}
              alt={user.display_name}
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-200 shadow-sm"
            />
            <div className="ml-4">
              <h1 className="text-sm font-semibold text-gray-900">{user.display_name}</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
          <a
            target="_blank"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            href={generateTwitterShareUrl(
              { name: user.display_name, analysis: data.summary, id: user.username },
              shareUrl
            )}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 256 256"
              height="1em"
              width="1em"
              className="mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
            </svg>
            Share
          </a>
          <DownloadButton cardRef={cardContentRef} fileName={"personalityCard"} />
          </div>
        </div>  

        {/* Analysis Content */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">

          {/* 三个关键点 */}
          <div className="space-y-4 mb-6">
            {data.points.map((point, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {point.body}
                </p>
              </div>
            ))}
          </div>

          {/* 总结 */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              总结：
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {data.summary}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row items-center justify-end pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <YouMindLogo/>
            <p className="text-sm text-gray-600 font-medium">Write something good.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
