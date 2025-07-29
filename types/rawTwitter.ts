  export interface RawTwitterPost {
    tweet_id: string
    text: string
    creation_date: string
    retweet: boolean
    favorite_count: number
    retweet_count: number
    reply_count: number
    quote_count: number
    views: number
    timestamp: number
    language: string
    source: string
    media_url: string[] | null
    video_url: string | null
    user: {
      username: string
      name: string
      follower_count: number
      following_count: number
      is_verified: boolean
      is_blue_verified: boolean
      profile_pic_url: string
      description: string
      number_of_tweets: number
    }
    retweet_status?: RawTwitterPost
    quoted_status?: RawTwitterPost
    extended_entities?: {
      media: Array<{
        type: string
        media_url_https: string
        url: string
      }>
    } | null
  }

  // 分页结果
  export interface PaginatedResult<T> {
    data: T[]
    continuation_token?: string
    total_count: number
  }

  export type ServiceResult<T> = { success: true; data: T } | { success: false; error: string }
  