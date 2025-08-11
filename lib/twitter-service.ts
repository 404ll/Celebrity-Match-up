import 'server-only';
import type { PaginatedResult, RawTwitterPost, ServiceResult } from '../types/rawTwitter';

export class TwitterService {
  private apiKey: string;
  private host = 'twitter154.p.rapidapi.com';
  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || '';
  }

  async getUserPost(
    username: string,
    options?: {
      limit?: number;
      user_id?: string;
      include_replies?: boolean;
      include_pinned?: boolean;
      continuation_token?: string;
    },
  ): Promise<ServiceResult<PaginatedResult<RawTwitterPost>>> {
    const cleanUsername = username.replace(/^@+/, '');

    // 构建查询参数
    const params = new URLSearchParams({
      username: cleanUsername,
      limit: (options?.limit || 40).toString(),
      include_replies: (options?.include_replies ?? false).toString(),
      include_pinned: (options?.include_pinned ?? false).toString(),
    });

    // 如果有user_id，添加到参数中
    if (options?.user_id) {
      params.set('user_id', options.user_id);
    }

    // 如果有continuation_token，添加到参数中
    if (options?.continuation_token) {
      params.set('continuation_token', options.continuation_token);
    }

    try {
      const url = `https://${this.host}/user/tweets?${params.toString()}`;
      console.log('🔄 请求 URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.host,
        },
      });

      console.log('🔄 响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP错误 ${response.status}: ${errorText}`);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }

      // 解析响应
      const jsonData = (await response.json()) as any;
      console.log('🔄 响应数据:', {
        resultsCount: jsonData.results?.length || 0,
        hasContinuationToken: !!jsonData.continuation_token,
      });

      // 客户端限制：确保不超过请求的limit
      const requestedLimit = options?.limit || 40;
      const limitedResults = jsonData.results?.slice(0, requestedLimit) || [];

      return {
        success: true,
        data: {
          data: limitedResults,
          continuation_token: jsonData.continuation_token,
          total_count: limitedResults.length,
        },
      };
    } catch (error) {
      console.error('❌ Twitter API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
