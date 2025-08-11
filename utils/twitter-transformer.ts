import type { TwitterPost } from '../types/index';
import type { RawTwitterPost } from '../types/rawTwitter';

// 转换推文为自定义格式
function transformPost(rawPost: RawTwitterPost): TwitterPost {
  return {
    tweet_id: rawPost.tweet_id,
    text: rawPost.text,
    language: rawPost.language,
    retweet_status: rawPost.retweet_status
      ? { username: rawPost.retweet_status.user.username }
      : null,
    quoted_status: rawPost.quoted_status ? { username: rawPost.quoted_status.user.username } : null,
  };
}

// 转换推文为自定义格式，用于AI分析
export function transformPostsForAI(rawPosts: RawTwitterPost[]): TwitterPost[] {
  // 先过滤和转换
  const transformedPosts = rawPosts
    .filter((post) => post.text && post.text.trim().length > 0)
    .map(transformPost);

  // 根据 tweet_id 去重
  const uniquePosts = transformedPosts.reduce((acc: TwitterPost[], current) => {
    const isDuplicate = acc.some((post) => post.tweet_id === current.tweet_id);
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);

  console.log(`📊 推文去重: ${transformedPosts.length} -> ${uniquePosts.length}`);
  return uniquePosts;
}
