'use client';

import { useEffect, useState } from 'react';
import { PersonalTasteDeepDiveCard } from '@/components/card/GrowthCard';
import { LaunchCard } from '@/components/card/LaunchCard';
import { TasteProfileCard } from '@/components/card/SoulFormulaCard';
import { mockUser } from '@/mock';
import type { AIAnalysisResult } from '@/types';
import { extractJsonFromMarkdown } from '@/utils/markdown-utils';

interface SimpleRealtimeCardProps {
  content: string;
  isStreaming: boolean;
}

export function SimpleRealtimeCard({ content, isStreaming }: SimpleRealtimeCardProps) {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // 尝试解析AI分析结果
  useEffect(() => {
    if (content) {
      try {
        const jsonContent = extractJsonFromMarkdown(content);
        const result = JSON.parse(jsonContent) as AIAnalysisResult;
        setAnalysisResult(result);
      } catch (error) {
        console.debug('解析AI结果失败（可能是数据不完整）:', error);
      }
    }
  }, [content]);

  if (!analysisResult) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          AI分析结果
          {isStreaming && (
            <span className="ml-2 inline-flex items-center">
              <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="text-sm text-green-600">正在生成...</span>
            </span>
          )}
        </h2>
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">
              {isStreaming ? 'AI正在分析您的数据...' : '等待AI分析结果'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        AI分析结果
        {isStreaming && (
          <span className="ml-2 inline-flex items-center">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span className="text-sm text-green-600">正在生成...</span>
          </span>
        )}
      </h2>
      <div className="space-y-6">
        {analysisResult.TasteProfile && (
          <TasteProfileCard analysisData={analysisResult.TasteProfile} user={mockUser} />
        )}
        {analysisResult.PersonalTasteDeepDive && (
          <PersonalTasteDeepDiveCard data={analysisResult.PersonalTasteDeepDive} user={mockUser} />
        )}
        {analysisResult.LaunchCard && (
          <LaunchCard data={analysisResult.LaunchCard} user={mockUser} />
        )}
      </div>
    </div>
  );
}
