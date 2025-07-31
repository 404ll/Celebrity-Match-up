import type { RawTwitterPost } from "@/types/rawTwitter"
import type { TwitterPost } from "@/types/index"

function transformPost(rawPost: RawTwitterPost): TwitterPost {
  return {
    tweet_id: rawPost.tweet_id,
    text: rawPost.text,
    language: rawPost.language,
    retweet_status: rawPost.retweet_status ? {user: {username: rawPost.retweet_status.user}} : null,
    quoted_status: rawPost.quoted_status ? {user: {username: rawPost.quoted_status.user}} : null
  }
}

export function transformPostsForAI(rawPosts: RawTwitterPost[]): TwitterPost[] {
  return rawPosts
    .filter(post => post.text && post.text.trim().length > 0)
    .map(transformPost)
} 