'use client';

import { useEffect, useState } from 'react';

interface RealtimeDisplayProps {
  chunks: string[];
  accumulatedContent: string;
  isStreaming: boolean;
  jsonRepairStatus?: {
    isRepairing: boolean;
    lastRepairTime?: Date;
    repairCount: number;
  };
}

export function RealtimeDisplay({
  chunks,
  accumulatedContent,
  isStreaming,
  jsonRepairStatus,
}: RealtimeDisplayProps) {
  const [displayContent, setDisplayContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (chunks.length > 0 && currentIndex < chunks.length) {
      // 模拟打字机效果
      const timer = setTimeout(() => {
        setDisplayContent((prev) => prev + chunks[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50); // 50ms延迟，模拟实时效果

      return () => clearTimeout(timer);
    }
  }, [chunks, currentIndex]);

  useEffect(() => {
    if (!isStreaming && accumulatedContent) {
      setDisplayContent(accumulatedContent);
    }
  }, [isStreaming, accumulatedContent]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        实时流式显示
        {isStreaming && (
          <span className="ml-2 inline-flex items-center">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span className="text-sm text-green-600">正在生成...</span>
          </span>
        )}
      </h2>

      <div className="space-y-4">
        {/* 实时内容显示 */}
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-sm font-medium text-gray-700 mb-2">实时内容</h3>
          <div className="text-sm text-gray-800 whitespace-pre-wrap min-h-[100px] max-h-[300px] overflow-y-auto">
            {displayContent || (
              <span className="text-gray-400 italic">
                {isStreaming ? '等待AI生成内容...' : '暂无内容'}
              </span>
            )}
          </div>
        </div>

        {/* 数据块统计 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-2xl font-bold text-blue-600">{chunks.length}</div>
            <div className="text-xs text-blue-700">数据块数量</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-2xl font-bold text-green-600">{displayContent.length}</div>
            <div className="text-xs text-green-700">当前字符数</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-2xl font-bold text-purple-600">{currentIndex}</div>
            <div className="text-xs text-purple-700">已处理块数</div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {jsonRepairStatus?.repairCount || 0}
            </div>
            <div className="text-xs text-orange-700">JSON修复次数</div>
            {jsonRepairStatus?.isRepairing && (
              <div className="text-xs text-orange-600 animate-pulse">修复中...</div>
            )}
          </div>
        </div>

        {/* 数据块详情 */}
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-sm font-medium text-gray-700 mb-2">数据块详情</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {chunks.map((chunk, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  块 {index + 1}
                </span>
                <span className="text-xs text-gray-500">{chunk.length} 字符</span>
                <span className="text-xs text-gray-400 truncate flex-1">
                  {chunk.substring(0, 50)}
                  {chunk.length > 50 ? '...' : ''}
                </span>
                {index < currentIndex && <span className="text-green-500 text-xs">✓</span>}
              </div>
            ))}
            {chunks.length === 0 && <p className="text-gray-500 text-center py-4">暂无数据块</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
