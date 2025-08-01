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
      // console.log("开始下载流程...");
      
      // 隐藏所有按钮
      const buttons = cardRef.current.querySelectorAll('button, a[target="_blank"]');
      const originalDisplays: string[] = [];
      
      // console.log(`找到 ${buttons.length} 个按钮需要隐藏`);
      
      buttons.forEach((button) => {
        const element = button as HTMLElement;
        originalDisplays.push(element.style.display);
        element.style.display = 'none';
      });

      // 等待一小段时间确保样式应用
      await new Promise(resolve => setTimeout(resolve, 200));

      // 临时设置卡片样式以确保完整显示
      const originalStyle = cardRef.current.style.cssText;
      cardRef.current.style.width = '800px';
      cardRef.current.style.height = 'auto';
      cardRef.current.style.overflow = 'visible';
      cardRef.current.style.position = 'relative';

      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("开始生成图片...");
      
      try {
        // 尝试使用更宽松的配置
        const dataUrl = await toPng(cardRef.current, { 
          cacheBust: true,
          width: 400,
          skipAutoScale: true,
          backgroundColor: '#ffffff', // 确保背景色
          style: {
            borderRadius: '8px',
            overflow: 'visible',
            border: 'none',
            padding: '20px', // 添加内边距确保内容不被裁剪
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
      } catch (pngError) {
        console.error("PNG生成失败，尝试其他方法:", pngError);
        
        // 如果PNG失败，尝试使用JPEG格式
        try {
          const { toJpeg } = await import('html-to-image');
          const jpegDataUrl = await toJpeg(cardRef.current, { 
            cacheBust: true,
            width: 800,
            pixelRatio: 1.5,
            skipAutoScale: false,
            backgroundColor: '#ffffff',
            style: {
              borderRadius: '8px',
              overflow: 'visible',
              border: 'none',
              padding: '20px',
            },
          });
          
          console.log("JPEG生成成功，开始下载..."); 
          download(jpegDataUrl, `${fileName}.jpg`);
          console.log("下载完成");
        } catch (jpegError) {
          console.error("JPEG生成也失败:", jpegError);
          throw jpegError;
        }
      }
      
      // 恢复原始样式
      cardRef.current.style.cssText = originalStyle;
      
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
      className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        width="1.5em"
        height="1.5em"
        className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 16l-5-5h3V4h4v7h3l-5 5z"></path>
        <path d="M20 18H4v-2h16v2z"></path>
      </svg>
      <span className="sm:block hidden">Save</span>
    </button>
  );
};
