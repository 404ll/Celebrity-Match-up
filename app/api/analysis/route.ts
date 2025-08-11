import { NextRequest } from 'next/server';
import { AIAnalysisService } from '../../../lib/ai-analysis-service';
import { UserInfo } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 开始处理流式分析请求');

    const body = (await req.json()) as { userInfo: UserInfo };
    const userInfo = body.userInfo;

    console.log('📊 用户信息:', {
      description: userInfo.description,
      tweetsCount: userInfo.tweets?.length || 0,
    });

    const ai = new AIAnalysisService();

    // 获取流式分析的结果
    const stream = await ai.analyzeUserTweetsWithFieldAnalysisStream(userInfo);

    console.log('✅ 流式分析启动成功');

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream', // SSE 流式格式
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        // 添加额外的Cloudflare兼容头
        'X-Accel-Buffering': 'no', // 禁用代理缓冲
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('❌ 流式分析失败:', error);

    const errorMessage = error instanceof Error ? error.message : '未知错误';
    const errorDetails = {
      type: 'error',
      error: errorMessage,
      timestamp: Date.now(),
      // 添加更多调试信息
      environment: process.env.NODE_ENV,
      platform: typeof globalThis !== 'undefined' && 'caches' in globalThis ? 'cloudflare' : 'node',
      hasApiKey: !!process.env.AIHUBMIX_API_KEY,
      baseUrl: process.env.YOUMIND_HOST || 'http://localhost:3001',
    };

    return new Response(`data: ${JSON.stringify(errorDetails)}\n\n`, {
      status: 500,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  }
}
