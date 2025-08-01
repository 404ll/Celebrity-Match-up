import { AIAnalysisResult } from "@/types";

/**
 * 将AI分析结果转换为组件可用的格式
 */
export function formatAIAnalysisResult(rawData: any): AIAnalysisResult {
  return {
    LaunchCard: {
      cardTitle: rawData.LaunchCard?.cardTitle || "出发指令",
      title: rawData.LaunchCard?.title || "",
      suggestions: rawData.LaunchCard?.suggestions || [],
      closingThought: rawData.LaunchCard?.closingThought || "",
    },
    GrowthCard: {
      cardTitle: rawData.GrowthCard?.cardTitle || "成长画像",
      points: rawData.GrowthCard?.points || [],
      summary: rawData.GrowthCard?.summary || "",
    },
    SoulFormula: {
      cardTitle: rawData.SoulFormula?.cardTitle || "灵魂匹配",
      tagline: rawData.SoulFormula?.tagline || "",
      matches: rawData.SoulFormula?.matches || [],
      finalIdentity: {
        title: rawData.SoulFormula?.finalIdentity?.title || "",
        identity: rawData.SoulFormula?.finalIdentity?.identity || "",
        identity_en: rawData.SoulFormula?.finalIdentity?.identity_en || ""
      }
    }
  };
}

/**
 * 验证AI分析结果数据的完整性
 */
export function validateAIAnalysisResult(data: any): boolean {
  const requiredFields = [
    'LaunchCard.cardTitle',
    'LaunchCard.title',
    'LaunchCard.suggestions',
    'LaunchCard.closingThought',
    'GrowthCard.cardTitle',
    'GrowthCard.points',
    'GrowthCard.summary',
    'SoulFormula.cardTitle',
    'SoulFormula.matches',
    'SoulFormula.finalIdentity'
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
  const topMatch = data.SoulFormula.matches[0];
  const identity = data.SoulFormula.finalIdentity.identity;
  
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