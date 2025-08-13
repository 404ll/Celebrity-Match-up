'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStreamAnalysis } from '@/hooks/useStreamAnalysis';
import { PersonalTasteDeepDiveCard } from '@/components/card/GrowthCard';
import { LaunchCard } from '@/components/card/LaunchCard';
import { TasteProfileCard } from '@/components/card/SoulFormulaCard';
import { MockAnalysisCard } from '@/components/card/MockAnalysisCard';
// import { mockUser } from '@/mock';
import {  NewAnalysisData } from '@/types';
import { mockAnalysisData } from '@/mock';

interface RealtimeCardProps {
  handle: string;
}

export function RealtimeCard({ handle }: RealtimeCardProps) {
  // 直接使用 mock 数据
  const [displayResult] = useState<NewAnalysisData>(mockAnalysisData);
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

  console.log('userDetails', JSON.stringify(userDetails));
  // 🚀 发起分析副作用 - 现在只是获取用户信息
  useEffect(() => {
    const doAnalysis = async () => {
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;
      await startAnalysis(handle);
    };
    doAnalysis();
  }, [handle, startAnalysis]);

  const cards = useMemo(() => {
    const user = userDetails;

    // 如果用户信息不存在，不渲染任何卡片
    if (!user) {
      return [];
    }

    const cardComponents = [];

    // 直接使用 mock 数据
    cardComponents.push(
      <MockAnalysisCard key="mock-analysis" analysisData={displayResult} user={user} />
    );

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

      {/* 用户信息加载提示 */}
      {!userDetails && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600 font-medium">正在获取用户信息...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
