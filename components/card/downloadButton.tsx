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
    if (!cardRef.current) {
      console.error("Download failed: cardRef.current is null");
      return;
    }

    try {
      console.log("开始下载流程...");
      
      // 隐藏所有按钮
      const buttons = cardRef.current.querySelectorAll('button, a[target="_blank"]');
      const originalDisplays: string[] = [];
      
      console.log(`找到 ${buttons.length} 个按钮需要隐藏`);
      
      buttons.forEach((button, index) => {
        const element = button as HTMLElement;
        originalDisplays.push(element.style.display);
        element.style.display = 'none';
      });

      // 等待一小段时间确保样式应用
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("开始生成图片...");
      
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        width: 800, // 增加到800px，提供更好的显示效果
        pixelRatio: 2,
        skipAutoScale: true,
        style: {
          borderRadius: '8px',
          overflow: 'hidden',
          border: 'none',
        },
        filter: (node: HTMLElement) => {
          const hasScrollbar = node.classList && node.classList.contains('scrollbar');
          const isStyleOrScript = node.tagName === 'STYLE' || node.tagName === 'SCRIPT';
          const isVideo = node.tagName === 'VIDEO';
          const isAudio = node.tagName === 'AUDIO';
          return !hasScrollbar && !isStyleOrScript && !isVideo && !isAudio;
        },
      });
      
      console.log("图片生成成功，开始下载...");
      download(dataUrl, `${fileName}.png`);
      console.log("下载完成");

      // 恢复按钮显示
      buttons.forEach((button, index) => {
        const element = button as HTMLElement;
        element.style.display = originalDisplays[index] || '';
      });
      
    } catch (err) {
      console.error("下载失败:", err);
      
      // 确保恢复按钮显示
      if (cardRef.current) {
        const buttons = cardRef.current.querySelectorAll('button, a[target="_blank"]');
        buttons.forEach(button => {
          const element = button as HTMLElement;
          element.style.display = '';
        });
      }
      
      // 显示用户友好的错误信息
      alert("下载失败，请重试");
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
