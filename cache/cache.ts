import { AIAnalysisResult, CachedUser, TwitterPost, TwitterUser } from '../types';

const CACHE_PREFIX = 'twitter:';
const CACHE_EXPIRY_KEY = 'cache_expiry';

// 临时内存缓存作为fallback
const tempCache = new Map<string, CachedUser>();

// 临时测试数据
const tempTestData: CachedUser = {
  userDetails: {
    username: 'elemen_7',
    display_name: 'Elemen',
    profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/elemen_400x400.jpg',
    description: 'Developer and creator',
  },
  analysis: {
    TasteProfile: {
      tagline: '用社区的热闹，对抗个人成长的焦虑；用代码的构建，实现对资本的野心。',
      matches: [
        {
          name: 'Paul Graham',
          identity_intro: 'Y Combinator 创始人，用《黑客与画家》等雄文定义了创业方法论。',
          percentage: 47,
          coreTaste: '#构想实体化冲动',
          explanation: '你对自己代码的执着渴望，正是驱动所有顶级黑客的核心燃料。',
        },
      ],
      finalIdentity: {
        title: '你的最终身份画像',
        identity: '在社区地图上寻找宝藏的未来架构师',
        identity_en: 'Future Architect Questing on a Community Map',
      },
    },
    PersonalTasteDeepDive: {
      title: '你的灵魂代码解剖报告',
      points: [
        {
          title: '知识的仓鼠，行动的起点',
          body: '你的推特就像一个勤劳的仓鼠洞，塞满了各种Web3教程、工具指南。',
        },
      ],
      summary: '停止自我怀疑。你是一个已经完成了"侦察和情报收集"阶段的未来玩家。',
    },
    LaunchCard: {
      title: '别再焦虑了，你的偶像喊你立刻动手！',
      suggestions: [
        {
          title: '来自PG的拷问：你的用户在哪儿？',
          body: '现在最没意义的事，就是对着镜子里的自己说我的代码是一坨。',
        },
      ],
      closingThought: '别怕代码是一坨屎，所有伟大的系统，都是从一坨能跑的屎开始的。',
    },
  },
  tweets: [],
};

// 初始化临时测试数据
tempCache.set('elemen_7', tempTestData);

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
