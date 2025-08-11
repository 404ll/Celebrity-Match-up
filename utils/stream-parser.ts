import type { StreamData } from '../lib/ai-analysis-service';
import type { AIAnalysisResult } from '../types';
import { cleanMarkdownJson } from './markdown-utils';
import { parsePartialJson } from './parse-partial-json';

export interface StreamParserCallbacks {
  onStatus?: (message: string) => void;
  onProgress?: (step: string, message: string, data?: any) => void;
  onPartialContent?: (content: string, accumulated: string) => void;
  onComplete?: (content: string) => void;
  onError?: (error: string) => void;
  onPartialJsonResult?: (result: Partial<AIAnalysisResult>) => void;
}

export class StreamParser {
  private callbacks: StreamParserCallbacks;
  private accumulatedContent = '';
  private buffer = '';

  constructor(callbacks: StreamParserCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * 解析流式数据块
   */
  parseChunk(chunk: string): void {
    this.buffer += chunk;

    const lines = this.buffer.split('\n');
    const completeLines = lines.slice(0, -1);
    const incompleteLine = lines[lines.length - 1] || '';

    for (const line of completeLines) {
      if (line.trim() && line.startsWith('data: ')) {
        this.parseStreamData(line);
      }
    }
    this.buffer = incompleteLine;
  }

  /**
   * 解析完整的流式数据行
   */
  parseStreamData(data: string): void {
    if (!data.startsWith('data: ')) {
      return;
    }

    const jsonData = data.slice(6);

    try {
      const parsed: StreamData = JSON.parse(jsonData);

      switch (parsed.type) {
        case 'status':
          this.callbacks.onStatus?.(parsed.message || '');
          break;

        case 'progress':
          this.callbacks.onProgress?.(parsed.step || '', parsed.message || '', parsed.data);
          console.log('进度更新:', parsed.step, '-', parsed.message, parsed.data);
          break;

        case 'partial_content':
          if (parsed.content && parsed.accumulated) {
            this.accumulatedContent = parsed.accumulated;
            this.callbacks.onPartialContent?.(parsed.content, parsed.accumulated);
            // 尝试解析累积的JSON内容
            this.tryParsePartialJson(parsed.accumulated);
          }
          break;

        case 'complete':
          if (parsed.content) {
            this.accumulatedContent = parsed.content;
            this.callbacks.onComplete?.(parsed.content);
            this.tryParsePartialJson(parsed.content);
          }
          break;

        case 'error':
          this.callbacks.onError?.(parsed.error || '未知错误');
          break;

        default:
          console.warn('未知的流式数据类型:', parsed.type);
      }
    } catch (e) {
      console.warn('解析流数据失败:', e, '原始数据:', data);
    }
  }

  /**
   * 处理流结束
   */
  flush(): void {
    if (this.buffer.trim()) {
      this.parseStreamData(this.buffer);
    }
  }

  /**
   * 尝试解析部分JSON数据
   */
  private tryParsePartialJson(content: string): void {
    try {
      const cleanContent = cleanMarkdownJson(content);
      const partialResult = parsePartialJson(cleanContent) as AIAnalysisResult | null;

      if (partialResult) {
        this.callbacks.onPartialJsonResult?.({
          TasteProfile: partialResult.TasteProfile,
          PersonalTasteDeepDive: partialResult.PersonalTasteDeepDive,
          LaunchCard: partialResult.LaunchCard,
        });
      }
    } catch (parseError) {
      console.warn('❌ 实时解析部分JSON失败:', parseError);
      console.log('解析失败的内容片段:', content.substring(0, 200));
    }
  }

  /**
   * 获取累积的内容
   */
  getAccumulatedContent(): string {
    return this.accumulatedContent;
  }

  /**
   * 获取缓冲区内容
   */
  getBuffer(): string {
    return this.buffer;
  }
}
