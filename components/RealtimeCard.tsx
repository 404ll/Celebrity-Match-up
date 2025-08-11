'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStreamAnalysis } from '@/hooks/useStreamAnalysis';
import { mockUser } from '@/mock';
import { AIAnalysisResult } from '@/types';
import { PersonalTasteDeepDiveCard } from '@/components/card/GrowthCard';
import { LaunchCard } from '@/components/card/LaunchCard';
import { TasteProfileCard } from '@/components/card/SoulFormulaCard';

interface RealtimeCardProps {
  handle: string;
}

export function RealtimeCard({ handle }: RealtimeCardProps) {
  const [displayResult, setDisplayResult] = useState<Partial<AIAnalysisResult>>({});
  const hasInitializedRef = useRef(false);

  const { isLoading, error, partialResult, userDetails, startAnalysis } = useStreamAnalysis({
    onProgress: () => {},
    onError: (error) => {
      console.error('分析错误:', error);
    },
    onComplete: () => {
      console.log('✅ 分析完成');
    },
  });

  // 🚀 发起分析副作用
  useEffect(() => {
    const doAnalysis = async () => {
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;
      await startAnalysis(handle);
    };
    doAnalysis();
  }, [handle]);

  // 🚧 合并中间流式结果
  useEffect(() => {
    if (partialResult) {
      setDisplayResult((prev) => ({ ...prev, ...partialResult }));
    }
  }, [partialResult]);

  useEffect(() => {
    if (!isLoading && partialResult) {
      setDisplayResult(partialResult);
    }
  }, [isLoading, partialResult]);

  const cards = useMemo(() => {
    const result = displayResult;
    const user = userDetails || mockUser;

    const cardComponents = [];

    if (result.TasteProfile) {
      cardComponents.push(
        <div key="taste-profile" className="bg-white rounded-lg shadow-lg p-6">
          <TasteProfileCard analysisData={result.TasteProfile} user={user} />
        </div>,
      );
    }

    if (result.PersonalTasteDeepDive) {
      cardComponents.push(
        <div key="personal-taste" className="bg-white rounded-lg shadow-lg p-6">
          <PersonalTasteDeepDiveCard data={result.PersonalTasteDeepDive} user={user} />
        </div>,
      );
    }

    if (result.LaunchCard) {
      cardComponents.push(
        <div key="launch-card" className="bg-white rounded-lg shadow-lg p-6">
          <LaunchCard data={result.LaunchCard} user={user} />
        </div>,
      );
    }

    return cardComponents;
  }, [displayResult, userDetails]);

  // 🔴 错误处理
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6">
        分析失败: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cards}

      {/* 初始加载提示 */}
      {!displayResult.TasteProfile &&
        !displayResult.PersonalTasteDeepDive &&
        !displayResult.LaunchCard &&
        isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 font-medium">正在生成分析结果...</span>
              </div>
            </div>
          </div>
        )}

      {/* 继续分析提示 */}
      {(displayResult.TasteProfile ||
        displayResult.PersonalTasteDeepDive ||
        displayResult.LaunchCard) &&
        isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700 text-sm font-medium">正在继续生成更多分析内容...</span>
            </div>
          </div>
        )}
    </div>
  );
}
