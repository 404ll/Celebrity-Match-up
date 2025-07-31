// growth/types/index.ts - 更新后的完整类型定义

export interface TwitterPost {
  tweet_id?: string;
  text: string;
  retweet_status: { username: string } | null;
  quoted_status: { username: string } | null;
  language?: string;
}

export interface TwitterUser {
  username: string;
  display_name: string;
  profile_image_url: string;
  description: string;
}

export interface UserInfo {
  description: string;
  tweets: TwitterPost[];
}

// AI分析结果相关类型
export interface PersonaBreakdown {
  percentage: number;
  name: string;
  contribution: string;
}

export interface ShareCardData {
  title: string;
  personaBreakdown: PersonaBreakdown[];
  summaryTitle: string;
  summaryBody: string;
  finalIdentity: string;
}

export interface DeepDiveData {
  points: Array<{
    title: string;
    body: string;
  }>;
  summary: string;
}

export interface SoulFormulaMatch {
  name: string;
  percentage: number;
  role: string;
  explanation: string;
}

export interface FinalIdentity {
  title: string;
  identity: string;
  identity_en: string;
}

export interface SoulFormulaData {
  tagline: string;
  matches: SoulFormulaMatch[];
  finalIdentity: FinalIdentity;
}

export interface AIAnalysisResult {
  shareCard: ShareCardData;
  deepDive: DeepDiveData;
  soulFormula: SoulFormulaData;
}

export interface AIServiceResult {
  success: boolean;
  analysis?: AIAnalysisResult;
  error?: string;
}

export interface UserFieldResult {
  domains: string[];
}

// Twitter API 响应类型
export interface TwitterAPIResponse {
  success: true;
  user: TwitterUser;
  tweets: TwitterPost[];
  analysis: AIAnalysisResult;
  tweet_count: number;
  timestamp: string;
}

export interface TwitterAPIErrorResponse {
  success: false;
  error: string;
  user?: TwitterUser;
  tweets?: TwitterPost[];
}

// 联合类型，表示可能的响应
export type TwitterAPIResult = TwitterAPIResponse | TwitterAPIErrorResponse;
