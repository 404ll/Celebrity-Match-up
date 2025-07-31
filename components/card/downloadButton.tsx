"use client";

import { toPng } from "html-to-image";
import download from "downloadjs";
import React from "react";

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  fileName: string;
}

export const DownloadButton = ({ cardRef, fileName }: DownloadButtonProps) => {
  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // 隐藏所有按钮
      const buttons = cardRef.current.querySelectorAll('button, a[target="_blank"]');
      const originalDisplays: string[] = [];
      
      buttons.forEach(button => {
        const element = button as HTMLElement;
        originalDisplays.push(element.style.display);
        element.style.display = 'none';
      });

      // 等待一小段时间确保样式应用
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        width: 400, // 固定宽度400px，优化移动端导出
        // height: undefined, // 不设置高度，让其自动适应内容高度
        pixelRatio: 2, // 保持高清晰度
        skipAutoScale: true, // 避免自动缩放
        style: {
          borderRadius: '8px',
          overflow: 'hidden',
          border: 'none',
        },
        filter: (node: HTMLElement) => {
          // 过滤掉不需要的元素
          const hasScrollbar = node.classList && node.classList.contains('scrollbar');
          const isStyleOrScript = node.tagName === 'STYLE' || node.tagName === 'SCRIPT';
          const isVideo = node.tagName === 'VIDEO';
          const isAudio = node.tagName === 'AUDIO';
          return !hasScrollbar && !isStyleOrScript && !isVideo && !isAudio;
        },
      });
      download(dataUrl, `${fileName}.png`);

      // 恢复按钮显示
      buttons.forEach((button, index) => {
        const element = button as HTMLElement;
        element.style.display = originalDisplays[index] || '';
      });
    } catch (err) {
      console.error("Download failed", err);
      
      // 确保恢复按钮显示
      const buttons = cardRef.current.querySelectorAll('button, a[target="_blank"]');
      buttons.forEach(button => {
        const element = button as HTMLElement;
        element.style.display = '';
      });
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1.5em"
        width="1.5em"
        className="mr-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 16l-5-5h3V4h4v7h3l-5 5z"></path>
        <path d="M20 18H4v-2h16v2z"></path>
      </svg>
      Save
    </button>
  );
};
