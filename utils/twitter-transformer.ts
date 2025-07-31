import type { RawTwitterPost } from "@/types/rawTwitter"
import type { TwitterPost } from "@/types/index"

// 转换推文为自定义格式
function transformPost(rawPost: RawTwitterPost): TwitterPost {
  return {
    tweet_id: rawPost.tweet_id,
    text: rawPost.text,
    language: rawPost.language,
    retweet_status: rawPost.retweet_status ? {username: rawPost.retweet_status.user.username} : null,
    quoted_status: rawPost.quoted_status ? {username: rawPost.quoted_status.user.username} : null
  }
}


// 转换推文为自定义格式，用于AI分析
export function transformPostsForAI(rawPosts: RawTwitterPost[]): TwitterPost[] {
  return rawPosts
    .filter(post => post.text && post.text.trim().length > 0)
    .map(transformPost)
}
