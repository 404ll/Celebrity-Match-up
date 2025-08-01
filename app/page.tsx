"use client";

import { Footer } from "@/components/footer";
import { LandingNavbar } from "@/components/navbar/landingNavbar";
import { YoumindCard } from "@/components/card/YoumindCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
 

export default function Home() {
  const [twitterHandle, setTwitterHandle] = useState("");
  const router = useRouter();
 
  const handleStartAnalysis = () => {
    if (twitterHandle.trim()) {
      const cleanHandle = twitterHandle.replace(/^@/, "");
      router.push(`/twitter/${cleanHandle}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStartAnalysis();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
     
      <div className="fixed top-0 left-0 right-0 z-50">
        <LandingNavbar />
      </div>

     
      <div className="flex-1 flex flex-col">
       
        <div className="flex flex-col items-center justify-center px-4 mt-20 sm:mt-28 w-full mx-auto">
          <h1 className="text-[24px] sm:text-[48px] font-bold text-center max-w-[1150px]">
            YouMind is the reimagined AI writing tool that can help anyone start
            creating. Capture ideas, gather materials, write drafts, and turn them
            into polished articles, podcasts, videos, and more.
          </h1>

          <p className="text-[16px] sm:text-xl text-gray-600 mt-8 leading-relaxed text-center max-w-[900px]">
            Based on your unique way of expressing yourself, AI will match you
            with public figures who share a similar sense of taste. Discover the
            "celebrity souls" that resonate with your inner style.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-4 max-w-[680px] mt-20 w-full mx-auto">
          <h2 className="text-[22px] md:text-[24px] font-medium text-center">
            Different on the outside, kindred in spirit.
          </h2>

          <div className="flex flex-row items-center justify-center gap-2 w-full mt-8 font-medium h-16">
            <input 
              type="text" 
              placeholder="Enter your twitter handle @username" 
              className="text-[16px] p-2 rounded-md border border-black w-full h-full px-4 py-2" 
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="bg-black text-white px-4 py-2 rounded-md min-w-[120px] h-full text-[16px] font-medium hover:bg-gray-800 transition-colors"
              onClick={handleStartAnalysis}
            >
              开始匹配
            </button>
          </div>

          <div className="flex flex-col items-center justify-center mt-12 w-full">
            <YoumindCard />
          </div>
        </div>

        <div className="w-full border-t border-gray-300 mt-8"></div>
       
        <div className="flex-1 flex items-center justify-center">
          <Footer />
        </div>
      </div>
    </div>
  );
}
