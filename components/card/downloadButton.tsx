"use client"

import type React from "react"
import { useRef, useState } from "react"
import ExportImagePreview, { type ExportImagePreviewRef } from "./ExportImagePreview"

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>
  fileName: string
}

export const DownloadButton = ({ cardRef, fileName }: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const exportRef = useRef<ExportImagePreviewRef>(null)

  const getSelector = () => {
    return () => cardRef.current
  }

  const handleDownload = async () => {
    if (!exportRef.current) {
      alert("导出组件未准备好，请稍后重试")
      return
    }

    if (!cardRef.current) {
      alert("目标元素未找到，请确保页面已完全加载")
      return
    }

    setIsDownloading(true)

    try {
      // 等待一下确保元素完全渲染
      await new Promise(resolve => setTimeout(resolve, 200))
      
      await exportRef.current.exportImage({
        filename: fileName,
        needDownload: true,
        format: "png",
        scale: 2, // 提高图片质量
      })
      console.log("下载完成")
    } catch (error) {
      console.error("下载失败:", error)
      alert("下载失败，请重试")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleExportError = (error: Error) => {
    console.error("导出错误:", error)
    alert(`导出失败: ${error.message}`)
  }

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : (
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
        )}
        <span className="sm:block hidden">
          {isDownloading ? "导出中..." : "Save"}
        </span>
      </button>

      {/* 隐藏的ExportImagePreview组件，用于导出功能 */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <ExportImagePreview
          ref={exportRef}
          selector={getSelector()}
          onExportError={handleExportError}
          offscreen={true}
          title={fileName}
          watermarkOptions={{
            show: true,
            type: "logo-text",
            position: "bottom-right",
            size: 14,
          }}
        />
      </div>
    </>
  )
}
