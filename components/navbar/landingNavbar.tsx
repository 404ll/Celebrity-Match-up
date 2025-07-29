"use client";

import { Globe } from "lucide-react";
import { YouMindLogo } from "@/components/icon/logo";
import { useState } from "react";

export function LandingNavbar() {
  const [language, setLanguage] = useState("en");

  const getLanguageWidth = (lang: string) => {
    const widthMap: { [key: string]: number } = {
      en: 96, // English - 基准宽度
      "zh-CN": 120, // 中文（简体）- 稍长
      "zh-TW": 148, // 繁體中文（台灣）- 更长
      "zh-HK": 148, // 繁體中文（香港）- 更长
      ja: 92, // 日本語 - 与英文相近
      ko: 92, // 한국어 - 与英文相近
      de: 100, // Deutsch - 与英文相近
      fr: 100, // Français - 与英文相近
      es: 100, // Español - 与英文相近
      ru: 108, // Русский - 与英文相近
      ar: 88, // العربية - 与英文相近
      fa: 88, // فارسی - 与英文相近
      th: 80, // ไทย - 与英文相近
      hi: 84, // हिन्दी - 与英文相近
      vi: 116, // Tiếng Việt - 与英文相近
      tr: 96, // Türkçe - 与英文相近
      uk: 120, // Українська - 与英文相近
      "pt-BR": 148, // Português(BR) - 与英文相近
      "pt-PT": 148, // Português(PT) - 与英文相近
      pl: 96, // Polski - 与英文相近
      cs: 96, // Čeština - 与英文相近
      nl: 124, // Nederlands - 与英文相近
      it: 96, // Italiano - 与英文相近
      id: 160, // Bahasa Indonesia - 与英文相近
      default: 96, // 默认使用英文宽度
    };
    return widthMap[lang] || widthMap["default"];
  };

  return (
    <nav className="grid h-20 w-full grid-cols-[1fr_1fr] items-center border-b bg-gray-50 md:px-12 px-2 shadow-md z-50">
    
      <div className="flex items-center justify-self-start">
        <a href="https://youmind.ai/overview" target="_blank">
        <YouMindLogo className="text-black font-medium" />
        <span className="text-sm md:text-base text-black ml-2">Write something good</span>
        </a>
      </div>

     
      <div className="flex items-center justify-self-end">
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
            className="h-9 rounded-sm text-sm hover:bg-gray-200 font-medium appearance-none focus:outline-none"
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
