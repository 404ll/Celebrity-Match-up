'use client';

import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { YouMindLogo } from '../icon/logo';

export function LandingNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const getLanguageWidth = (lang: string) => {
    const widthMap: { [key: string]: number } = {
      'en-US': 108, // English - 基准宽度
      'zh-CN': 92, // 中文（简体）- 稍短
      default: 100, // 默认使用英文宽度
    };
    return widthMap[lang] || widthMap['default'];
  };

  const handleLanguageChange = (newLocale: string) => {
    // 构建新的路径
    const segments = pathname.split('/');
    // 找到语言段的位置（通常是第2个段，索引为1）
    const localeIndex = segments.findIndex((segment) => segment === 'en-US' || segment === 'zh-CN');

    if (localeIndex !== -1) {
      segments[localeIndex] = newLocale;
    } else {
      // 如果没有找到语言段，在开头插入
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <nav className="flex h-20 w-full items-center justify-between border-b bg-gray-50 md:px-12 px-2 shadow-md z-50">
      <div className="flex items-center justify-self-start sm:mb-0 mb-2">
        <Link href="https://youmind.ai/overview" target="_blank">
          <div className="flex items-center gap-2">
            <div className="w-24 h-5 md:w-48 md:h-7">
              <YouMindLogo className="w-full h-full" />
            </div>
            <span className="hidden md:inline text-gray-900 font-medium text-lg">
              Write something good
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-self-end border-1 border-gray-200 rounded-md">
        <div className="relative inline-block">
          <select
            id="language-select"
            value="en-US"
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              width: `${getLanguageWidth('en-US')}px`,
              paddingRight: '16px',
              paddingLeft: '28px',
            }}
            className="h-9 rounded-sm sm:text-lg text-sm hover:bg-gray-200 font-medium appearance-none focus:outline-none"
          >
            <option value="en-US">English</option>
            <option value="zh-CN">中文</option>
          </select>
          <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
        </div>
      </div>
    </nav>
  );
}
