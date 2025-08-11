'use client';

import { Footer } from '@/components/footer';
import { AnalysisLoading } from '@/components/AnalysisLoading';
import { YoumindCard } from '@/components/card/YoumindCard';
import { DetailNavbar } from '@/components/navbar/detailNavbar';
import { RealtimeCard } from '@/components/RealtimeCard';
import { useAnalysisStatus } from '@/hooks/useAnalysisStatus';
import { useStreamAnalysis } from '@/hooks/useStreamAnalysis';

interface TwitterAnalysisClientProps {
  handle: string;
}

export function TwitterAnalysisClient({ handle }: TwitterAnalysisClientProps) {
  const { status, updateStepProgress, formatTime } = useAnalysisStatus();

  // 使用新的 hook
  const { isLoading, error } = useStreamAnalysis({
    onProgress: updateStepProgress,
    onError: (error) => {
      console.error('分析错误:', error);
    },
    onComplete: () => {
      console.log('✅ 分析完成');
    },
  });

  // 如果有错误，显示错误页面
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="fixed top-0 left-0 right-0 z-50">
          <DetailNavbar />
        </div>
        <div className="flex-1 flex items-center justify-center pt-32">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="text-red-600 text-lg font-semibold mb-2">分析失败</div>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 返回渲染结果页面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 px-4 py-12 sm:px-12 md:px-28 md:pt-24 to-purple-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DetailNavbar />
      </div>

      <div className="flex-1 flex flex-col pt-24 w-full mx-auto px-4">
        {/* 主标题区域 */}
        <div className="text-center mb-12 relative">
          {/* 装饰性背景元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              名人匹配
            </span>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              结果
            </span>
          </h1>

          {/* 副标题 */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            基于你的表达方式，AI为你匹配了相似品味的名人。
            <br className="hidden sm:block" />
            发现与你内心风格共鸣的"名人灵魂"。
          </p>

          {/* 装饰性分隔线 */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>

        {/* 分析状态显示 */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mb-8">
            <AnalysisLoading status={status} formatTime={formatTime} />
          </div>
        )}

        {/* 人格分析区域 */}
        {/* 保护类型，如果userDetails为空，则使用mockUser */}
        <RealtimeCard handle={handle} />
        {/* YouMind 卡片 */}
        <div className="flex flex-col items-center justify-center rounded-2xl p-8 text-white text-center mb-8">
          <YoumindCard />
        </div>

        <div className="w-full border-t border-gray-300 mt-8"></div>

        <div className="flex-1 flex items-center justify-center">
          <Footer />
        </div>
      </div>
    </div>
  );
}
