import { type NextRequest, NextResponse } from "next/server"
import { TwitterService } from "@/lib/twitter-service"
import { TwitterTransformer } from "@/utils/twitter-transformer"
import { AIAnalysisService } from "@/lib/ai-analysis-service"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const max_tweets = searchParams.get("max_tweets") || "20"
  const analysis_type = searchParams.get("type") || "analysis" // analysis 或 profile

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const twitterService = new TwitterService()
    const aiService = new AIAnalysisService()
    
    // 获取推文数据
    const tweetsResult = await twitterService.getUserPost(username, {
      limit: parseInt(max_tweets),
      include_replies: false,
      include_pinned: true
    })

    if (tweetsResult.success && tweetsResult.data.data.length > 0) {
      // 从第一条推文中提取用户信息
      const userFromTweet = tweetsResult.data.data[0].user
      
      // 转换推文为自定义格式
      const transformedTweets = TwitterTransformer.transformPostsForAI(tweetsResult.data.data)
      
      // 构建用户信息
      const user: any = {
        username: userFromTweet.username,
        display_name: userFromTweet.name,
        profile_image_url: userFromTweet.profile_pic_url,
        followers_count: userFromTweet.follower_count,
        following_count: userFromTweet.following_count,
        tweet_count: userFromTweet.number_of_tweets,
        description: userFromTweet.description,
        verified: userFromTweet.is_verified || userFromTweet.is_blue_verified
      }

      // 根据分析类型调用不同的 AI 服务
      let aiResult
      if (analysis_type === "profile") {
        aiResult = await aiService.generateUserProfile(user, transformedTweets)
      } else {
        aiResult = await aiService.analyzeUserTweets(user, transformedTweets)
      }

      if (aiResult.success) {
        return NextResponse.json({
          success: true,
          user: user,
          tweets: transformedTweets,
          analysis: aiResult.analysis || aiResult.profile,
          analysis_type: analysis_type,
          tweet_count: transformedTweets.length,
          timestamp: new Date().toISOString()
        })
      } else {
        return NextResponse.json({
          success: false,
          error: aiResult.error,
          user: user,
          tweets: transformedTweets
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: tweetsResult.success ? "No tweets found" : tweetsResult.error
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
} 