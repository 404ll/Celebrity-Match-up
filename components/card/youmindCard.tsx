'use client';
import Link from 'next/link';
import React from 'react';

export const YoumindCard = () => {
  return (
    <div className="bg-white text-gray-900 z-10 relative rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
      <div className="text-center">
        <div className="mb-4 sm:mb-6">
          <img src="/cover.png" alt="YouMind Card" className="h-auto rounded-xl shadow-lg" />
        </div>
        <h3 className="sm:text-xl text-md font-bold text-gray-900 mb-3 sm:mb-4">
          我们通过推文了解你，
          <br />
          你，可以通过写作认识你自己。
          <br />
          来YouMind，写一段只属于你的文字。
        </h3>

        <Link
          href="https://youmind.ai/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 sm:text-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          Get Started Now
          <svg
            className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};
