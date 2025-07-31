export interface TwitterPost {
  tweet_id: string;
  text: string;
  retweet_status: { user: { username: string } } | null;
  quoted_status: { user: { username: string } } | null;
  language: string;
}

export interface TwitterUser {
  username: string;
  display_name: string;
  profile_image_url: string;
  description: string;
}

// AI分析结果相关类型
export interface ShareCardData {
  mix: Array<{
    name: string;
    percentage: number;
    trait: string;
  }>;
  identity: string;
}

export interface DeepDiveData {
  points: Array<{
    title: string;
    body: string;
  }>;
  summary: string;
}

export interface SoulFormulaData {
  tagline: string;
  matches: Array<{
    name: string;
    percentage: number;
    role: string;
    explanation: string;
  }>;
  finalIdentity: {
    identity: string;
    identity_en: string;
  };
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
