'use client';

import { useRef, useState } from 'react';
import { AnalysisStatus } from '../types';

export const useAnalysisStatus = () => {
  const lastUpdateRef = useRef<{ stepId: string; message: string } | null>(null);

  const [status, setStatus] = useState<AnalysisStatus>({
    currentStep: 'tweets-fetching',
    elapsedTime: 0,
    estimatedTime: 0,
    isDelayed: false,
    message: '正在从Twitter获取用户的最新推文...',
  });

  // 根据流式进度信息更新状态
  const updateStepProgress = (stepId: string, message: string, data?: any) => {
    // 检查是否是重复的更新
    const lastUpdate = lastUpdateRef.current;
    if (lastUpdate && lastUpdate.stepId === stepId && lastUpdate.message === message) {
      console.log(`⏭️ 跳过重复更新: ${stepId} - ${message}`);
      return;
    }

    // console.log(`🔄 updateStepProgress 被调用: ${stepId} - ${message} `, data);
    lastUpdateRef.current = { stepId, message };

    setStatus((prev) => {
      // console.log(`✅ 更新状态: ${stepId} - ${message}`);
      return {
        ...prev,
        currentStep: stepId,
        message: message,
      };
    });
  };

  // 格式化时间显示（保留以防其他地方需要）
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  return {
    status,
    updateStepProgress,
    formatTime,
  };
};
