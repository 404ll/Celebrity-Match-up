"use client";

import { ChevronLeft, Globe } from "lucide-react";
import Link from "next/link";
import { YouMindLogoWithText } from "@/components/icon/logo";
import { useState } from "react";

export function DetailNavbar() {
  const [language, setLanguage] = useState("en");

  const getLanguageWidth = (lang: string) => {
    const widthMap: { [key: string]: number } = {
      en: 104, // English - 基准宽度
      "zh-CN": 128, // 中文（简体）- 稍长
      "zh-TW": 156, // 繁體中文（台灣）- 更长
      "zh-HK": 156, // 繁體中文（香港）- 更长
      ja: 100, // 日本語 - 与英文相近
      ko: 100, // 한국어 - 与英文相近
      de: 108, // Deutsch - 与英文相近
      fr: 108, // Français - 与英文相近
      es: 108, // Español - 与英文相近
      ru: 116, // Русский - 与英文相近
      ar: 96, // العربية - 与英文相近
      fa: 96, // فارسی - 与英文相近
      th: 88, // ไทย - 与英文相近
      hi: 96, // हिन्दी - 与英文相近
      vi: 128, // Tiếng Việt - 与英文相近
      tr: 104, // Türkçe - 与英文相近
      uk: 128, // Українська - 与英文相近
      "pt-BR": 164, // Português(BR) - 与英文相近
      "pt-PT": 164, // Português(PT) - 与英文相近
      pl: 104, // Polski - 与英文相近
      cs: 104, // Čeština - 与英文相近
      nl: 128, // Nederlands - 与英文相近
      it: 104, // Italiano - 与英文相近
      id: 188, // Bahasa Indonesia - 与英文相近
      default: 100, // 默认使用英文宽度
    };
    return widthMap[lang] || widthMap["default"];
  };

  return (
    <nav className="flex h-24 w-full items-center justify-between border-b bg-gray-50 md:px-12 px-2 shadow-md z-50">
      <div className="flex items-center gap-4">
        <div className="md:flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-black hover:bg-gray-200 transition-all border-2 px-3 py-1 rounded-sm h-9"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className=" hidden md:block text-lg font-medium text-black">
              Homepage
            </span>
          </Link>
        </div>
       
      </div>

      {/*Brand text or ph info */}
      <div className="hidden md:flex items-center justify-center whitespace-nowrap">
        <Link href="https://youmind.ai/overview" target="_blank">
          <YouMindLogoWithText text="Write something good" size="xl" />
        </Link>
      </div>

      {/*Language selector */}
      <div className="flex items-center">
        <div className="relative inline-block">
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: `${getLanguageWidth(language)}px`,
              paddingRight: "16px",
              paddingLeft: "28px",
            }}
            className="h-9 rounded-sm sm:text-lg text-sm hover:bg-gray-200 font-medium appearance-none focus:outline-none"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="cs">Čeština</option>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
            <option value="nl">Nederlands</option>
            <option value="pt-BR">Português(BR)</option>
            <option value="pt-PT">Português(PT)</option>
            <option value="pl">Polski</option>
            <option value="ru">Русский</option>
            <option value="vi">Tiếng Việt</option>
            <option value="tr">Türkçe</option>
            <option value="uk">Українська</option>
            <option value="zh-CN">中文（简体）</option>
            <option value="zh-TW">繁體中文（台灣）</option>
            <option value="zh-HK">繁體中文（香港）</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="ar">العربية</option>
            <option value="fa">فارسی</option>
            <option value="th">ไทย</option>
            <option value="hi">हिन्दी</option>
          </select>
          <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
        </div>
      </div>
    </nav>
  );
}
