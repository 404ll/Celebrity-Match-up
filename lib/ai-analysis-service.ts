import OpenAI from 'openai'
import type { TwitterPost, TwitterUser } from '@/types/index'

export class AIAnalysisService {
  private openai: OpenAI

  constructor() {
    const apiKey = process.env.AIHUBMIX_API_KEY || '';
    
    this.openai = new OpenAI({
      baseURL: 'https://aihubmix.com/v1',
      apiKey: apiKey
    })
  }

  /**
   * 分析用户的推文内容
   */
  async analyzeUserTweets(user: TwitterUser, tweets: TwitterPost[]): Promise<any> {
    try {
      // 构建分析提示
      const prompt = this.buildAnalysisPrompt(user, tweets)
      
      const completion = await this.openai.chat.completions.create({
        model: 'gemini-2.5-pro',
        messages: [
          {
            "role": 'user',
            "content": prompt
          }
        ],
      })

      return {
        success: true,
        analysis: completion.choices[0].message.content,
        user: user,
        tweet_count: tweets.length
      }
    } catch (error) {
      console.error('AI Analysis Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI analysis failed'
      }
    }
  }

  /**
   * 构建分析提示
   */
  private buildAnalysisPrompt(user: TwitterUser, tweets: TwitterPost[]): string {
    const userInfo = `
用户信息：
- 用户名：${user.username}
- 显示名：${user.display_name}
- 简介：${user.description}
`

    const tweetsInfo = tweets.map((tweet, index) => `
推文 ${index + 1}：
- 内容：${tweet.text}
`).join('\n')

    return `
请分析以下 Twitter 用户的内容风格和特点：

${userInfo}

最近 ${tweets.length} 条推文：
${tweetsInfo}

请从以下角度进行分析：
1. 内容主题和兴趣领域
2. 表达风格和语言特点
3. 互动情况（点赞、转发、回复）
4. 用户画像和个性特征
5. 内容质量和影响力评估

请用中文回答，分析要详细且有条理。
`
  }

  /**
   * 生成用户画像
   */
  async generateUserProfile(user: TwitterUser, tweets: TwitterPost[]): Promise<any> {
    try {
      const prompt = `
基于以下 Twitter 用户数据，生成详细的用户画像：

用户基本信息：
- 用户名：${user.username}
- 显示名：${user.display_name}
- 简介：${user.description}


请生成包含以下内容的用户画像：
1. 职业和身份推测
2. 兴趣领域和专长
3. 性格特点分析
4. 内容创作风格
5. 社交影响力评估
6. 潜在价值和建议

请用中文回答，格式要清晰。
`

      const completion = await this.openai.chat.completions.create({
        model: 'gemini-2.5-pro',
        messages: [
          {
            "role": "user",
            "content": prompt
          }
        ],
      })

      const profileContent = completion.choices[0].message.content;
      
      return {
        success: true,
        profile: profileContent || "无法生成用户画像",
        user: user
      }
    } catch (error) {
      console.error('Profile Generation Error:', error)
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile generation failed'
      }
    }
  }
} 