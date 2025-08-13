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
export interface Suggestion {
  title: string;
  body: string;
}

export interface LaunchCardData {
  title: string;
  suggestions: Suggestion[];
  closingThought: string;
}

export interface PersonalTasteDeepDiveData {
  title: string;
  points: Array<{
    title: string;
    body: string;
  }>;
  summary: string;
}

export interface SoulFormulaMatch {
  name: string;
  identity_intro: string;
  percentage: number;
  coreTaste: string;
  explanation: string;
}

export interface FinalIdentity {
  title: string;
  identity: string;
  identity_en: string;
}

export interface TasteProfileData {
  tagline: string;

  matches: SoulFormulaMatch[];
  finalIdentity: FinalIdentity;
}

export interface AIAnalysisResult {
  TasteProfile?: TasteProfileData;
  PersonalTasteDeepDive?: PersonalTasteDeepDiveData;
  LaunchCard?: LaunchCardData;
  // 新的mock数据结构
  summary?: string;
  title?: string;
  matches?: Array<{
    name: string;
    match_percentage: number;
    tags: string[];
  }>;
}

export interface AIServiceResult {
  success: boolean;
  analysis?: AIAnalysisResult;
  error?: string;
}

export interface UserData {
  success: boolean;
  data: {
    tweets: TwitterPost[];
    userDetails: TwitterUser;
  };
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

export interface CachedUser {
  userDetails: TwitterUser;
  analysis: AIAnalysisResult;
  tweets: TwitterPost[];
}

// 简化的时间感知状态
export interface AnalysisStatus {
  currentStep: string;
  elapsedTime: number;
  estimatedTime: number;
  isDelayed: boolean;
  message: string;
}

// 联合类型，表示可能的响应
export type TwitterAPIResult = TwitterAPIResponse | TwitterAPIErrorResponse;

// 新的mock数据结构
export interface NewAnalysisData {
  summary: string;
  title: string;
  matches: Array<{
    name: string;
    match_percentage: number;
    tags: string[];
  }>;
}
