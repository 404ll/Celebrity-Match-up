import type { TwitterPost, UserFieldResult } from '../types/index';
import { UserInfo } from '../types/index';
import { cleanMarkdownJson } from '../utils/markdown-utils';
import { USER_FIELD_PROMPT } from './field-prompt';
import { MAGIC_MIRROR_VERDICT_PROMPT } from './match-prompt';

// 流式数据类型定义
export interface StreamData {
  type: 'status' | 'progress' | 'partial_content' | 'complete' | 'error';
  message?: string;
  content?: string;
  accumulated?: string;
  timestamp: number;
  error?: string;
  step?: string;
  data?: any;
}

interface DatabaseEntry {
  name: string;
  username: string;
  field: string;
  taste_labels: Array<{
    label: string;
    definition: string;
  }>;
}

interface Databases {
  [key: string]: DatabaseEntry[];
}

export class AIAnalysisService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AIHUBMIX_API_KEY || '';
    this.baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : '';

    // 添加调试信息
    console.log('🔧 AIAnalysisService 初始化:', {
      hasApiKey: !!this.apiKey,
      baseUrl: this.baseUrl,
      environment: process.env.NODE_ENV,
      platform: typeof globalThis !== 'undefined' && 'caches' in globalThis ? 'cloudflare' : 'node',
    });
  }

  // 流式分析
  async analyzeUserTweetsWithFieldAnalysisStream(
    userInfo: UserInfo,
  ): Promise<ReadableStream<Uint8Array>> {
    const tweets = userInfo.tweets.slice(0, 10);
    const self = this; // 保存对服务实例的引用

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const encoder = new TextEncoder();

          // 步骤1: 领域分析
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'progress',
                step: 'field-analysis',
                message: '开始领域分析...',
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );

          const fieldResult = await self.analyzeUserField({ ...userInfo, tweets });

          if (!fieldResult.domains || !Array.isArray(fieldResult.domains)) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: '用户领域分析失败或格式错误',
                  timestamp: Date.now(),
                })}\n\n`,
              ),
            );
            controller.close();
            return;
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'progress',
                step: 'field-analysis',
                message: '领域分析完成',
                data: { domains: fieldResult.domains },
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );

          // 步骤2: 数据库加载
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'progress',
                step: 'database-loading',
                message: '开始加载数据库...',
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );

          const databases = await self.loadDatabasesByTags(fieldResult.domains);

          if (Object.keys(databases).length === 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: '没有找到对应的数据库文件',
                  timestamp: Date.now(),
                })}\n\n`,
              ),
            );
            controller.close();
            return;
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'progress',
                step: 'database-loading',
                message: '数据库加载完成',
                data: {
                  loadedCount: Object.keys(databases).length,
                  domains: Object.keys(databases),
                },
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );

          // 步骤3: AI分析
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'progress',
                step: 'ai-analysis',
                message: '开始AI分析...',
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );

          // 继续原有的AI分析流
          const prompt = self.buildSoulMatchmakerPrompt(tweets, databases);
          const apiKey = self.apiKey;

          console.log('🔑 准备发送AI请求:', {
            apiKeyLength: apiKey.length,
            apiKeyPrefix: apiKey.substring(0, 10) + '...',
            promptLength: prompt.length,
            model: 'gemini-2.5-pro',
          });

          const response = await fetch('https://aihubmix.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gemini-2.5-pro',
              messages: [{ role: 'user', content: prompt }],
              stream: true,
            }),
          });

          if (!response.ok) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: `HTTP error! status: ${response.status}`,
                  timestamp: Date.now(),
                })}\n\n`,
              ),
            );
            controller.close();
            return;
          }

          if (!response.body) {
            controller.error(new Error('No response body'));
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedContent = '';
          let buffer = ''; // 添加缓冲区来处理分割的数据

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk; // 将新数据添加到缓冲区

              // 按行分割并处理
              const lines = buffer.split('\n');
              // 保留最后一行（可能不完整）
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.trim() && line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: 'complete',
                          content: accumulatedContent,
                          timestamp: Date.now(),
                        })}\n\n`,
                      ),
                    );
                    controller.close();
                    return;
                  }

                  try {
                    // 验证数据是否为有效的JSON
                    if (!data.trim() || !data.includes('{')) {
                      continue; // 跳过无效数据
                    }

                    const parsed = JSON.parse(data);

                    // 验证解析后的数据结构
                    if (!parsed || typeof parsed !== 'object') {
                      continue;
                    }

                    if (
                      parsed.choices &&
                      Array.isArray(parsed.choices) &&
                      parsed.choices[0] &&
                      parsed.choices[0].delta &&
                      parsed.choices[0].delta.content
                    ) {
                      const content = parsed.choices[0].delta.content;
                      accumulatedContent += content;

                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify({
                            type: 'partial_content',
                            content: content,
                            accumulated: accumulatedContent,
                            timestamp: Date.now(),
                          })}\n\n`,
                        ),
                      );
                    }
                  } catch (e) {
                    // 只有在数据看起来像JSON但解析失败时才记录警告
                    if (data.trim() && (data.includes('{') || data.includes('['))) {
                      console.warn('解析AI流数据失败:', e, '数据:', data.substring(0, 100));
                    }
                    // 不发送错误，继续处理下一个数据块
                  }
                }
              }
            }
          }

          // 处理缓冲区中剩余的数据
          if (buffer.trim()) {
            try {
              const data = buffer.trim();
              if (data.startsWith('data: ')) {
                const jsonData = data.slice(6);
                if (jsonData !== '[DONE]' && jsonData.trim() && jsonData.includes('{')) {
                  const parsed = JSON.parse(jsonData);
                  if (
                    parsed.choices &&
                    Array.isArray(parsed.choices) &&
                    parsed.choices[0] &&
                    parsed.choices[0].delta &&
                    parsed.choices[0].delta.content
                  ) {
                    const content = parsed.choices[0].delta.content;
                    accumulatedContent += content;

                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: 'partial_content',
                          content: content,
                          accumulated: accumulatedContent,
                          timestamp: Date.now(),
                        })}\n\n`,
                      ),
                    );
                  }
                }
              }
            } catch (e) {
              console.warn('处理缓冲区数据失败:', e);
            }
          }

          controller.close();
        } catch (error) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: error instanceof Error ? error.message : '未知错误',
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });
  }

  // 加载数据库
  async loadDatabasesByTags(tags: string[]): Promise<Databases> {
    const databases: Databases = {};
    const startAll = Date.now();

    for (const tag of tags) {
      try {
        const start = Date.now();
        const url = `${this.baseUrl}/celebrityData/${tag}.json`;
        const response = await fetch(url);
        const duration = Date.now() - start;

        if (response.ok) {
          const data = (await response.json()) as DatabaseEntry[];
          databases[tag] = data;
          console.log(`✅ 加载数据库: ${tag} (${data.length} 条记录) - 用时 ${duration}ms`);
        } else {
          console.warn(`⚠️ 数据库文件不存在: ${tag}.json (${response.status}) - 用时 ${duration}ms`);
        }
      } catch (error) {
        console.warn(`⚠️ 加载数据库失败: ${tag}.json`, error);
      }
    }

    console.log(`📦 数据库加载总用时: ${Date.now() - startAll}ms`);
    return databases;
  }

  // 流式分析
  analyzeUserTweetsStream(tweets: TwitterPost[], databases: Databases): ReadableStream<Uint8Array> {
    const prompt = this.buildSoulMatchmakerPrompt(tweets, databases);
    const apiKey = this.apiKey;

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const encoder = new TextEncoder();

          // 发送开始状态
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'status',
                message: '开始AI分析...',
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );

          const response = await fetch('https://aihubmix.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gemini-2.5-pro',
              messages: [{ role: 'user', content: prompt }],
              stream: true,
            }),
          });

          if (!response.ok) {
            // 发送错误状态
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: `HTTP error! status: ${response.status}`,
                  timestamp: Date.now(),
                })}\n\n`,
              ),
            );
            controller.close();
            return;
          }

          if (!response.body) {
            controller.error(new Error('No response body'));
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedContent = '';
          let buffer = ''; // 添加缓冲区来处理分割的数据

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk; // 将新数据添加到缓冲区

              // 按行分割并处理
              const lines = buffer.split('\n');
              // 保留最后一行（可能不完整）
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.trim() && line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    // 发送完成状态
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: 'complete',
                          content: accumulatedContent,
                          timestamp: Date.now(),
                        })}\n\n`,
                      ),
                    );
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    if (
                      parsed.choices &&
                      parsed.choices[0] &&
                      parsed.choices[0].delta &&
                      parsed.choices[0].delta.content
                    ) {
                      const content = parsed.choices[0].delta.content;
                      accumulatedContent += content;

                      // 发送部分内容
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify({
                            type: 'partial_content',
                            content: content,
                            accumulated: accumulatedContent,
                            timestamp: Date.now(),
                          })}\n\n`,
                        ),
                      );
                    }
                  } catch (e) {
                    // 只有在数据看起来像JSON但解析失败时才记录警告
                    if (data.trim() && (data.includes('{') || data.includes('['))) {
                      console.warn('解析AI流数据失败:', e, '数据:', data.substring(0, 100));
                    }
                    // 不发送错误，继续处理下一个数据块
                  }
                }
              }
            }
          }

          // 处理缓冲区中剩余的数据
          if (buffer.trim()) {
            try {
              const data = buffer.trim();
              if (data.startsWith('data: ')) {
                const jsonData = data.slice(6);
                if (jsonData !== '[DONE]') {
                  const parsed = JSON.parse(jsonData);
                  if (
                    parsed.choices &&
                    parsed.choices[0] &&
                    parsed.choices[0].delta &&
                    parsed.choices[0].delta.content
                  ) {
                    const content = parsed.choices[0].delta.content;
                    accumulatedContent += content;

                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          type: 'partial_content',
                          content: content,
                          accumulated: accumulatedContent,
                          timestamp: Date.now(),
                        })}\n\n`,
                      ),
                    );
                  }
                }
              }
            } catch (e) {
              console.warn('处理缓冲区数据失败:', e);
            }
          }

          controller.close();
        } catch (error) {
          // 发送错误状态
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: error instanceof Error ? error.message : '未知错误',
                timestamp: Date.now(),
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });
  }

  async analyzeUserField(userInfo: UserInfo): Promise<UserFieldResult> {
    const prompt = this.buildUserFieldPrompt(userInfo);
    const start = Date.now();

    const response = await fetch('https://aihubmix.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash-nothink',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const duration = Date.now() - start;
    console.log(`🧠 analyzeUserField 请求耗时: ${duration}ms`);

    const data = (await response.json()) as any;
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI 返回内容为空');
    }

    const cleanContent = cleanMarkdownJson(content);
    return JSON.parse(cleanContent) as UserFieldResult;
  }

  private buildSoulMatchmakerPrompt(tweets: TwitterPost[], databases: Databases): string {
    return `${MAGIC_MIRROR_VERDICT_PROMPT}

# INPUT_USER_TWEETS
${JSON.stringify(tweets, null, 2)}

# INPUT_DATABASES
${JSON.stringify(databases, null, 2)}

请按照上述步骤进行分析，并返回符合OUTPUT_JSON_STRUCTURE格式的JSON结果。
`;
  }

  private buildUserFieldPrompt(userInfo: UserInfo): string {
    return `${USER_FIELD_PROMPT}

请分析以下用户信息：

# INPUT_USER_INFO
${JSON.stringify(userInfo, null, 2)}

请返回JSON格式的结果，包含选中的领域标签数组。
`;
  }
}
