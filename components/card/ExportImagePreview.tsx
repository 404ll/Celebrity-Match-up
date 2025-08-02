"use client";

import { toPng } from "html-to-image";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/**
 * 导出图片预览组件的引用接口
 */
export interface ExportImagePreviewRef {
  /** 导出图片的方法 */
  exportImage: (options?: ExportOptions) => Promise<string | void>;
  /** 是否正在导出中 */
  isExporting: boolean;
}

/**
 * 导出选项配置接口
 */
export interface ExportOptions {
  /** 文件名（不包含扩展名） */
  filename?: string;
  /** 是否需要自动下载 */
  needDownload?: boolean;
  /** 导出格式：PNG 或 JPEG */
  format?: "png" | "jpeg";
  /** 图片质量（仅对 JPEG 有效，0-1） */
  quality?: number;
  /** 缩放比例，用于提高导出图片的清晰度 */
  scale?: number;
}

/**
 * 导出图片预览组件的属性接口
 */
export interface ExportImagePreviewProps {
  /** 目标元素选择器，可以是 CSS 选择器字符串或返回元素的函数 */
  selector: string | (() => HTMLElement | null);
  /** 导出成功时的回调函数 */
  onExportSuccess?: (dataUrl: string) => void;
  /** 导出失败时的回调函数 */
  onExportError?: (error: Error) => void;
  /** 是否在屏幕外渲染（用于性能优化） */
  offscreen?: boolean;
  /** 标题文本 */
  title?: string;
  /** 水印配置 */
  watermarkOptions?: {
    show?: boolean;
    type?: "logo-text" | "logo-only" | "text-only";
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    size?: number;
  };
}

/**
 * 导出图片预览组件
 */
const ExportImagePreview = forwardRef<
  ExportImagePreviewRef,
  ExportImagePreviewProps
>(({ 
  selector, 
  onExportSuccess, 
  onExportError,
  offscreen = false,
  title,
  watermarkOptions,
}, ref) => {
  // 导出容器引用，用于获取整个导出区域
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 导出状态，用于显示加载动画
  const [isExporting, setIsExporting] = useState(false);

  /**
   * 获取目标元素
   */
  const getTargetElement = (): HTMLElement | null => {
    if (typeof selector === "function") {
      return selector();
    }
    return document.querySelector(selector);
  };

  /**
   * 等待所有资源加载完成
   */
  const waitForResources = async (element: HTMLElement): Promise<void> => {
    // 等待所有图片加载完成
    const images = element.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          const loadHandler = () => {
            img.removeEventListener("load", loadHandler);
            img.removeEventListener("error", loadHandler);
            resolve();
          };
          img.addEventListener("load", loadHandler);
          img.addEventListener("error", loadHandler);
          setTimeout(resolve, 3000);
        }
      });
    });

    // 等待字体加载完成
    if (document.fonts) {
      await document.fonts.ready;
    }

    await Promise.all(imagePromises);
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  /**
   * 导出图片的核心方法
   */
  const exportImage = async (options: ExportOptions = {}) => {
    const {
      filename = title || `export-${new Date().getTime()}`,
      needDownload = true,
      format = "png",
      scale = 2,
    } = options;

    if (!wrapperRef.current) {
      onExportError?.(new Error("Export failed: no wrapper element found"));
      return;
    }

    setIsExporting(true);
    
    try {
      const element = wrapperRef.current;
      await waitForResources(element);

      const exportOptions = {
        pixelRatio: scale,
        backgroundColor: "transparent",
        cacheBust: true,
        skipAutoScale: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          margin: "0",
          padding: "0",
          border: "none",
          outline: "none",
          position: "static",
          left: "0",
          top: "0",
          transform: "none",
        },
        filter: (node: HTMLElement) => {
          if (
            node.nodeType === Node.COMMENT_NODE ||
            node.tagName === "SCRIPT" ||
            node.tagName === "STYLE" ||
            node.tagName === "NOSCRIPT"
          )
            return false;
          if (
            node.classList &&
            (node.classList.contains("no-export") ||
              node.classList.contains("export-ignore"))
          )
            return false;
          return true;
        },
        includeQueryParams: true,
      };

      const dataUrl = await toPng(element, exportOptions);

      if (!dataUrl || dataUrl.length < 100) {
        throw new Error("Generated image appears to be empty or corrupted");
      }

      if (needDownload) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${filename}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      onExportSuccess?.(dataUrl);
      return dataUrl;
    } catch (error) {
      onExportError?.(error instanceof Error ? error : new Error("Export failed"));
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      exportImage,
      isExporting,
    }),
    [isExporting]
  );

  /**
   * 渲染预览内容
   */
  const renderContent = () => {
    const targetElement = getTargetElement();
    if (!targetElement) {
      return <div className="text-gray-500">No content found</div>;
    }

    // 创建目标元素的深度克隆
    const clonedElement = targetElement.cloneNode(true) as HTMLElement;
    
    // 复制计算样式到克隆元素
    const copyComputedStyles = (source: Element, target: Element) => {
      const sourceStyles = window.getComputedStyle(source);
      const targetElement = target as HTMLElement;

      const importantStyles = [
        "width", "height", "padding", "margin", "border",
        "font-family", "font-size", "font-weight", "line-height",
        "color", "background-color", "background-image",
        "display", "position", "top", "left", "right", "bottom",
        "transform", "opacity", "z-index",
      ];

      importantStyles.forEach((prop) => {
        targetElement.style.setProperty(
          prop,
          sourceStyles.getPropertyValue(prop)
        );
      });
    };

    const copyStylesRecursively = (source: Element, target: Element) => {
      copyComputedStyles(source, target);

      const sourceChildren = source.children;
      const targetChildren = target.children;

      for (
        let i = 0;
        i < sourceChildren.length && i < targetChildren.length;
        i++
      ) {
        copyStylesRecursively(sourceChildren[i], targetChildren[i]);
      }
    };

    copyStylesRecursively(targetElement, clonedElement);

    // 移除不需要导出的元素
    const elementsToHide = clonedElement.querySelectorAll(
      'button, a[target="_blank"], a[href*="twitter"], a[href*="share"], .no-export, .export-ignore, [data-no-export="true"]'
    );
    elementsToHide.forEach((element) => {
      (element as HTMLElement).style.display = "none";
    });

    return (
      <div
        ref={wrapperRef}
        style={{
          width: "fit-content",
          minWidth: "400px",
          overflow: "visible",
          padding: "0",
          margin: "0",
          position: "static",
          left: "0",
          top: "0",
          transform: "none",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "0",
            margin: "0",
            position: "static",
            left: "0",
            top: "0",
            transform: "none",
          }}
          dangerouslySetInnerHTML={{ __html: clonedElement.outerHTML }}
        />
        
        {/* 水印 */}
        {watermarkOptions?.show && (
          <div 
            className={`watermark watermark-${watermarkOptions.position || 'top-right'}`}
            style={{
              position: 'absolute',
              fontSize: `${watermarkOptions.size || 16}px`,
              color: 'rgba(0,0,0,0.3)',
              pointerEvents: 'none',
              ...(watermarkOptions.position === 'top-left' && { top: '8px', left: '8px' }),
              ...(watermarkOptions.position === 'top-right' && { top: '8px', right: '8px' }),
              ...(watermarkOptions.position === 'bottom-left' && { bottom: '8px', left: '8px' }),
              ...(watermarkOptions.position === 'bottom-right' && { bottom: '8px', right: '8px' }),
            }}
          >
            {watermarkOptions.type === 'logo-only' ? '🎯' : 
             watermarkOptions.type === 'text-only' ? 'YouMind' :
             '🎯 YouMind'}
          </div>
        )}
      </div>
    );
  };

  // 渲染组件
  return (
    <div className="export-preview-container">
      {/* 导出加载遮罩层 */}
      {isExporting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">正在导出图片...</p>
          </div>
        </div>
      )}
      {/* 渲染预览内容 */}
      {!offscreen && renderContent()}
      {/* 屏幕外渲染的内容 */}
      {offscreen && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          {renderContent()}
        </div>
      )}
    </div>
  );
});

ExportImagePreview.displayName = "ExportImagePreview";

export default ExportImagePreview;
