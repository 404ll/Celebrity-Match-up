import { AIAnalysisResult } from "@/types";

/**
 * 将AI分析结果转换为组件可用的格式
 */
export function formatAIAnalysisResult(rawData: any): AIAnalysisResult {
  return {
    shareCard: {
      title: rawData.shareCard?.title || "AI Taste Analysis",
      mix: rawData.shareCard?.mix || [],
      identity: rawData.shareCard?.identity || "",
      callToAction: rawData.shareCard?.callToAction || "Discover your soul formula"
    },
    deepDive: {
      title: rawData.deepDive?.title || "Deep Dive Analysis",
      introduction: rawData.deepDive?.introduction || "",
      points: rawData.deepDive?.points || [],
      summary: rawData.deepDive?.summary || ""
    },
    soulFormula: {
      title: rawData.soulFormula?.title || "Your Soul Formula",
      alert: rawData.soulFormula?.alert || "",
      introduction: rawData.soulFormula?.introduction || "",
      tagline: rawData.soulFormula?.tagline || "",
      matches: rawData.soulFormula?.matches || [],
      finalIdentity: {
        title: rawData.soulFormula?.finalIdentity?.title || "Your Identity",
        identity: rawData.soulFormula?.finalIdentity?.identity || "",
        identity_en: rawData.soulFormula?.finalIdentity?.identity_en || ""
      }
    }
  };
}

/**
 * 验证AI分析结果数据的完整性
 */
export function validateAIAnalysisResult(data: any): boolean {
  const requiredFields = [
    'shareCard.title',
    'shareCard.mix',
    'shareCard.identity',
    'deepDive.title',
    'deepDive.points',
    'soulFormula.title',
    'soulFormula.matches',
    'soulFormula.finalIdentity'
  ];

  for (const field of requiredFields) {
    const value = field.split('.').reduce((obj, key) => obj?.[key], data);
    if (!value) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }

  return true;
}

/**
 * 生成AI分析结果的摘要
 */
export function generateAnalysisSummary(data: AIAnalysisResult): string {
  const topMatch = data.shareCard.mix[0];
  const identity = data.soulFormula.finalIdentity.identity;
  
  return `${topMatch?.name || 'Unknown'} (${topMatch?.percentage || 0}%) - ${identity}`;
}

/**
 * 格式化百分比显示
 */
export function formatPercentage(percentage: number): string {
  return `${percentage}%`;
}

/**
 * 获取匹配项的颜色主题
 */
export function getMatchColorTheme(index: number): string {
  const themes = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-indigo-500 to-blue-600'
  ];
  
  return themes[index % themes.length];
}

/**
 * 清理和格式化文本内容
 */
export function cleanTextContent(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 将 **text** 转换为 <strong>text</strong>
    .replace(/#([^#]+)/g, '<span class="text-blue-600 font-medium">#$1</span>'); // 将 #tag 转换为带样式的标签
} 