"use client";

import React, { useRef } from "react";
import { ShareCardData, TwitterUser } from "@/types/index";
import { YouMindLogo } from "../icon/logo";
import { generateShareUrl, generateTwitterShareUrl } from "@/utils/card-utils";
import { DownloadButton } from "./downloadButton";

interface MainCardProps {
  data: ShareCardData;
  user: TwitterUser;
}

export const MainCard = ({ data, user }: MainCardProps) => {
  const cardContentRef = useRef<HTMLDivElement>(null);
  // console.log("mainCard", data);
  return (
    <div
      ref={cardContentRef}
      className="text-card-foreground shadow-lg overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col p-8 text-black">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={user.profile_image_url}
                alt={user.display_name}
                width={40}
                height={40}
                className="rounded-full shadow-md"
              />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">
                {user.display_name}
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              target="_blank"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-105"
              href={generateTwitterShareUrl(
                {
                  name: user.display_name,
                  analysis: data.finalIdentity,
                  id: user.username,
                },
                user.username
                  ? generateShareUrl(user.username)
                  : "https://growth-kulpq3oxj-elemens-projects.vercel.app/twitter/" +
                      user.username
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
            <DownloadButton cardRef={cardContentRef} fileName={"mainCard"} />
          </div>
        </div>

        <div className="flex flex-row justify-between items-start mb-6 w-full gap-4">
          {/* Analysis Content */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 mb-4 shadow-lg flex-1">
            {/* 扫描结果标题 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-800">
                  你的数字人格是以下三者的黄金共振体：
                </h2>
              </div>
            </div>

            {/* 匹配项 */}
            <div className="mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 左侧：匹配项列表 */}
                <div className="space-y-3">
                  {data.personaBreakdown.map((item, index) => (
                    <div
                      key={item.name}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h3 className="font-bold text-gray-900 text-base">
                            {item.name}
                          </h3>
                        </div>
                        <span className="text-base font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {item.percentage}%
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <span className="font-semibold text-blue-800">「{item.contribution}」</span>
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* 右侧：雷达图 */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center mb-2">
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        人格雷达图
                      </h4>
                    </div>
                    <img
                      src={"/images/radar.png"}
                      alt={"人格雷达图"}
                      width={240}
                      height={240}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 灵魂身份展示 */}
            <div className="pt-2 mt-2">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-4 shadow-inner">
                {/* <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
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
                        d="M13 16h-1v-4h-1m1-4h.01M12 20.5C7.305 20.5 3.5 16.695 3.5 12S7.305 3.5 12 3.5 20.5 7.305 20.5 12 16.695 20.5 12 20.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-blue-800 tracking-wide">
                      灵魂总结
                    </h3>
                  </div>
                </div> */}
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      {data.summaryTitle}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {data.summaryBody}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      你的身份
                    </span>
                    <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-wider">
                      {data.finalIdentity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-row items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <YouMindLogo />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Write something good.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
