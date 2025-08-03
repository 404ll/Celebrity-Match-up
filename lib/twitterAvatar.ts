import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 获取 Twitter 高清头像 URL
 * @param url 原始 Twitter 头像 URL
 * @param fallback 备用图片路径
 * @returns 高清头像 URL 或备用图片路径
 */
export function getTwitterHighQualityAvatar(url: string | null | undefined, fallback: string = "/images/youmindCardTest.jpg"): string {
  if (!url) return fallback;
  
  // 尝试获取最大尺寸
  if (url.includes('_normal.jpg')) {
    return url.replace('_normal.jpg', '_400x400.jpg');
  }
  if (url.includes('_bigger.jpg')) {
    return url.replace('_bigger.jpg', '_400x400.jpg');
  }
  if (url.includes('_mini.jpg')) {
    return url.replace('_mini.jpg', '_400x400.jpg');
  }
  
  return url;
}

/**
 * 获取 Twitter 头像 URL（支持自定义尺寸）
 * @param url 原始 Twitter 头像 URL
 * @param size 目标尺寸 ('mini', 'normal', 'bigger', '400x400')
 * @param fallback 备用图片路径
 * @returns 指定尺寸的头像 URL 或备用图片路径
 */
export function getTwitterAvatarBySize(
  url: string | null | undefined, 
  size: 'mini' | 'normal' | 'bigger' | '400x400' = '400x400',
  fallback: string = "/images/youmindCardTest.jpg"
): string {
  if (!url) return fallback;
  
  const sizeMap = {
    'mini': '_mini.jpg',
    'normal': '_normal.jpg', 
    'bigger': '_bigger.jpg',
    '400x400': '_400x400.jpg'
  };
  
  // 移除现有的尺寸后缀
  const baseUrl = url.replace(/_(mini|normal|bigger|400x400)\.jpg$/, '');
  
  return `${baseUrl}${sizeMap[size]}`;
}
