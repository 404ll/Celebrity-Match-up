import { AIAnalysisResult, CachedUser, TwitterPost, TwitterUser } from '../types';

const CACHE_PREFIX = 'twitter:';
const CACHE_EXPIRY_KEY = 'cache_expiry';

// 临时内存缓存作为fallback
const tempCache = new Map<string, CachedUser>();

// 清理测试数据，使用真实数据
// const tempTestData: CachedUser = { ... }; // 已删除测试数据

// 不再预填充测试数据
// tempCache.set('elemen_7', tempTestData);

// 检查localStorage是否可用
function isLocalStorageAvailable(): boolean {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// 写入缓存到localStorage
export async function cacheAnalysisResultKV(
  username: string,
  userDetails: TwitterUser,
  tweets: TwitterPost[],
  analysis: AIAnalysisResult,
) {
  try {
    if (!isLocalStorageAvailable()) {
      // 如果localStorage不可用，使用临时内存缓存
      console.warn('localStorage not available, using temporary memory cache');
      const cachedUser: CachedUser & { cachedAt: string } = {
        userDetails,
        tweets,
        analysis,
        cachedAt: new Date().toISOString(),
      };
      tempCache.set(username, cachedUser);
      console.log(`✅ 缓存已保存到临时内存: ${username}`);
      return;
    }

    const cachedUser: CachedUser & { cachedAt: string } = {
      userDetails,
      tweets,
      analysis,
      cachedAt: new Date().toISOString(),
    };

    const key = `${CACHE_PREFIX}${username}`;
    const expiryKey = `${key}_expiry`;
    
    // 设置缓存过期时间（7天后过期）
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    // 保存用户数据和过期时间到localStorage
    localStorage.setItem(key, JSON.stringify(cachedUser));
    localStorage.setItem(expiryKey, expiryDate.toISOString());

    console.log(`✅ 缓存已保存到localStorage: ${username}`);
  } catch (error) {
    console.error('保存缓存失败:', error);

    // 出错时也使用临时内存缓存
    const cachedUser: CachedUser & { cachedAt: string } = {
      userDetails,
      tweets,
      analysis,
      cachedAt: new Date().toISOString(),
    };
    tempCache.set(username, cachedUser);
    console.log(`✅ 错误后使用临时内存缓存: ${username}`);
  }
}

// 从localStorage读取缓存
export async function getCachedAnalysisKV(username: string): Promise<CachedUser | null> {
  try {
    if (!isLocalStorageAvailable()) {
      // 如果localStorage不可用，从临时内存缓存读取
      console.warn('localStorage not available, using temporary memory cache');
      const cached = tempCache.get(username);
      if (cached) {
        console.log(`📖 从临时内存缓存读取: ${username}`);
        return cached;
      }
      console.log(`❌ 临时内存缓存中未找到: ${username}`);
      return null;
    }

    const key = `${CACHE_PREFIX}${username}`;
    const expiryKey = `${key}_expiry`;
    
    // 检查是否过期
    const expiryStr = localStorage.getItem(expiryKey);
    if (expiryStr) {
      const expiryDate = new Date(expiryStr);
      if (new Date() > expiryDate) {
        // 缓存已过期，删除它
        localStorage.removeItem(key);
        localStorage.removeItem(expiryKey);
        return null;
      }
    }
    
    const result = localStorage.getItem(key);
    if (!result) return null;

    return JSON.parse(result) as CachedUser;
  } catch (e) {
    console.error('Failed to get cache from localStorage, trying temporary cache', e);

    // 出错时尝试从临时内存缓存读取
    const cached = tempCache.get(username);
    if (cached) {
      console.log(`📖 错误后从临时内存缓存读取: ${username}`);
      return cached;
    }
    return null;
  }
}

// 删除指定用户的缓存
export async function deleteCachedAnalysisKV(username: string) {
  try {
    if (!isLocalStorageAvailable()) {
      // 如果localStorage不可用，从临时内存缓存删除
      console.warn('localStorage not available, using temporary memory cache');
      tempCache.delete(username);
      console.log(`🗑️ 缓存已从临时内存删除: ${username}`);
      return;
    }

    const key = `${CACHE_PREFIX}${username}`;
    const expiryKey = `${key}_expiry`;
    
    localStorage.removeItem(key);
    localStorage.removeItem(expiryKey);

    console.log(`🗑️ 缓存已从localStorage删除: ${username}`);
  } catch (error) {
    console.error('删除缓存失败:', error);

    // 出错时也从临时内存缓存删除
    tempCache.delete(username);
    console.log(`🗑️ 错误后从临时内存删除: ${username}`);
  }
}

// 清理过期的缓存
export async function cleanupExpiredCache(): Promise<number> {
  try {
    if (!isLocalStorageAvailable()) {
      return 0;
    }

    let deletedCount = 0;
    const keysToDelete: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && !key.endsWith('_expiry')) {
        const expiryKey = `${key}_expiry`;
        const expiryStr = localStorage.getItem(expiryKey);
        
        if (expiryStr) {
          const expiryDate = new Date(expiryStr);
          if (new Date() > expiryDate) {
            keysToDelete.push(key);
            keysToDelete.push(expiryKey);
          }
        }
      }
    }
    
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
      deletedCount++;
    });
    
    if (deletedCount > 0) {
      console.log(`🧹 已清理 ${deletedCount} 个过期缓存项`);
    }
    
    return deletedCount;
  } catch (error) {
    console.error('清理过期缓存失败:', error);
    return 0;
  }
}
