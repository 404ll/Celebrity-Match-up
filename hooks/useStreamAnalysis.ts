import { useCallback, useEffect, useRef, useState } from 'react';
import { cacheAnalysisResultKV, getCachedAnalysisKV } from '../cache/cache';
import { AIAnalysisResult, TwitterUser, UserData, UserInfo } from '../types';
import { cleanMarkdownJson } from '../utils/markdown-utils';
import { StreamParser } from '../utils/stream-parser';

interface UseStreamAnalysisOptions {
  onProgress?: (step: string, message: string, data?: any) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
  onUserDataFetched?: (userData: UserData) => void;
}

interface UseStreamAnalysisReturn {
  isLoading: boolean;
  error: string | null;
  partialResult: Partial<AIAnalysisResult>;
  userDetails: TwitterUser | null;
  startAnalysis: (handle: string) => Promise<void>;
  reset: () => void;
}

export const useStreamAnalysis = (
  options: UseStreamAnalysisOptions = {},
): UseStreamAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialResult, setPartialResult] = useState<Partial<AIAnalysisResult>>({});
  const [userDetails, setUserDetails] = useState<TwitterUser | null>(null);

  // 使用 useRef 来跟踪初始化状态，避免重复执行
  const initRef = useRef(false);
  const currentHandleRef = useRef<string>(''); // 跟踪当前处理的 handle
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setPartialResult({});
    setUserDetails(null);
    initRef.current = false;
    currentHandleRef.current = ''; // 重置当前处理的 handle
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const startAnalysis = useCallback(
    async (handle: string) => {
      console.log('🔄 startAnalysis 被调用:', {
        handle,
        currentHandle: currentHandleRef.current,
        initRef: initRef.current,
      });

      // 检查是否正在处理相同的 handle
      if (currentHandleRef.current === handle && initRef.current) {
        console.log('🔄 分析已在进行中或已完成，跳过重复调用:', handle);
        return;
      }

      // 如果是新的 handle，重置状态
      if (currentHandleRef.current !== handle) {
        console.log('🔄 新的 handle，重置状态:', handle);
        initRef.current = false;
        currentHandleRef.current = handle;
      }

      // 如果已经在处理中，跳过
      if (initRef.current) {
        console.log('🔄 分析已在进行中，跳过重复调用');
        return;
      }

      // 立即标记为处理中，防止并发调用
      initRef.current = true;

      const cached = await getCachedAnalysisKV(handle);
      if (cached) {
        console.log('🔄 从缓存中获取分析结果...');
        setPartialResult(cached.analysis);
        setUserDetails(cached.userDetails);
        console.log('🔄 缓存中获取的用户信息:', cached.analysis);
        console.log('用户推文', cached.tweets);
        // console.log("原json数据", JSON.stringify(cached.analysis, null, 2));
        setIsLoading(false);
        // initRef.current 已经在上面设置为 true
        return;
      }

      console.log('🔄 缓存中没有分析结果，开始初始化分析...');
      // initRef.current 已经在上面设置为 true
      setIsLoading(true);
      setError(null);
      setPartialResult({});
      setUserDetails(null); // 重置用户信息

      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      try {
        options.onProgress?.('tweets-fetching', '正在获取推文数据...', null);

        // 获取推文数据
        const response = await fetch(
          `/api/tweets?handle=${encodeURIComponent(handle)}`,
          { signal: abortControllerRef.current.signal },
        );

        if (!response.ok) {
          throw new Error(`获取推文失败: ${response.status}`);
        }

        const userData = (await response.json()) as UserData;

        if (!userData.success) {
          throw new Error('获取推文失败');
        }

        const tweets = userData.data.tweets;
        const currentUserDetails = userData.data.userDetails;

        options.onProgress?.('tweets-fetching', '推文获取完成:', `获取到${tweets.length}条推文`);
        options.onUserDataFetched?.(userData);
        setUserDetails(currentUserDetails);

        // 使用真实的用户信息进行流式分析
        const userInfo: UserInfo = {
          description: handle,
          tweets: tweets,
        };

        const res = await fetch('/api/analysis', {
          method: 'POST',
          body: JSON.stringify({ userInfo }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        if (!res.body) {
          throw new Error('No response body');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        const streamParser = new StreamParser({
          onProgress: options.onProgress,
          onPartialJsonResult: (result) => {
            setPartialResult((prev) => {
              const merged = { ...prev, ...result };
              return merged;
            });
          },
          onComplete: (content) => {
            console.log('✅ 分析完成');
            options.onProgress?.('complete', '分析完成');
            try {
              // 清理 Markdown 格式后再解析
              const cleanContent = cleanMarkdownJson(content);
              const parsedAnalysis: AIAnalysisResult = JSON.parse(cleanContent);
              setPartialResult(parsedAnalysis);
              console.log('🔄 缓存分析结果...');
              console.log('🔄 缓存用户信息:', currentUserDetails);
              // 使用当前获取的用户信息进行缓存
              cacheAnalysisResultKV(handle, currentUserDetails, tweets, parsedAnalysis);
            } catch (err) {
              console.error('解析完整内容失败', err);
              console.log('原始内容:', content.substring(0, 200));
            }
            options.onComplete?.();
            setIsLoading(false);
          },
          onError: (err) => {
            console.error(`错误: ${err}`);
            setError(err);
            options.onError?.(err);
            setIsLoading(false);
          },
        });

        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            streamParser.parseChunk(decoder.decode(value, { stream: true }));
          }
          streamParser.flush();
        } catch (streamError) {
          console.error('流式读取错误:', streamError);
          // 尝试从已有的部分结果中恢复
          if (streamError instanceof Error && streamError.message.includes('network error')) {
            console.log('检测到网络中断，尝试使用部分结果...');
            streamParser.flush(); // 处理已收到的数据
          } else {
            throw streamError;
          }
        }
      } catch (err) {
        // 如果是取消操作，不设置错误
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('分析被取消');
          return;
        }

        console.error('流式处理失败:', err);
        const errorMessage = err instanceof Error ? err.message : '未知错误';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [options],
  );

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isLoading,
    error,
    partialResult,
    userDetails,
    startAnalysis,
    reset,
  };
};
