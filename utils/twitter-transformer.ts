import type { RawTwitterPost } from "@/types/rawTwitter"
import type { TwitterPost } from "@/types/index"

export class TwitterTransformer {
  /**
   * 将原生 Twitter API 响应转换为自定义的 TwitterPost 类型
   */
  static transformPost(rawPost: RawTwitterPost): TwitterPost {
    return {
      tweet_id: rawPost.tweet_id,
      text: rawPost.text,
      language: rawPost.language,
      retweet_status: rawPost.retweet_status ? this.transformPost(rawPost.retweet_status) : null,
      quoted_status: rawPost.quoted_status ? this.transformPost(rawPost.quoted_status) : null
    }
  }

  /**
   * 批量转换推文数组
   */
  static transformPosts(rawPosts: RawTwitterPost[]): TwitterPost[] {
    return rawPosts.map(post => this.transformPost(post))
  }

  /**
   * 过滤和转换推文，只保留需要的字段
   */
  static transformPostsForAI(rawPosts: RawTwitterPost[]): TwitterPost[] {
    return rawPosts
      .filter(post => post.text && post.text.trim().length > 0) // 过滤空推文
      .map(post => this.transformPost(post))
  }
} 