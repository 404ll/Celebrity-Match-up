export interface TwitterPost {
    tweet_id: string
    text: string
    retweet_status: TwitterPost | null
    quoted_status: TwitterPost | null
    language: string
  }

  export interface TwitterUser {
    username: string
    display_name: string
    profile_image_url: string
    description: string
  }

  export interface MainCardData {
  id?: string;
  name: string;
  image: string;
  analysis: string;
}

export interface PersonalityCardData {
  id?: string;
  name: string;
  image: string;
  personality: string;
}

export interface DeepMatchCardData {
  id?: string;
  name: string;
  image: string;
  deepMatch: string;
}