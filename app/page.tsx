"use client";

import React from "react";
import { Footer } from "@/components/footer";
import { LandingNavbar } from "@/components/navbar/landingNavbar";
import { YoumindCard } from "../components/card/YoumindCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Fixed navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80 border-b border-white/20">
        <LandingNavbar />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pt-20">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Main content */}
          <div className="text-center mb-16 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50 mt-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Personality Matching
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover Your
              </span>

              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Celebrity Twin
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Based on your unique way of expressing yourself, our AI will match
              you with public figures who share a similar sense of taste and
              personality.
            </p>

            {/* Tagline */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                Different on the outside, kindred in spirit.
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Input section */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Enter your Twitter handle"
                      className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/90"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 min-w-[180px] justify-center"
                    onClick={handleStartAnalysis}
                  >
                    Start Matching
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card showcase */}
            <div className="flex justify-center mb-16">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <YoumindCard />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <Footer />
        </div>
      </div>
    </div>
  );
}
