import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { DetailNavbar } from "@/components/navbar/detailNavbar";
import { YoumindCard } from "@/components/card/youmindCard";
import { TwitterService } from "@/lib/twitter-service";
// import { transformPostsForAI } from "@/utils/twitter-transformer";
// import { AIAnalysisService } from "@/lib/ai-analysis-service";
import { getTwitterHighQualityAvatar } from "@/lib/utils";
import { notFound } from "next/navigation";
import { MainCard } from "@/components/card/mainCard";
import { TwitterUser } from "@/types/index";
import { DeepMatchCard } from "@/components/card/deepMatch";
import { PersonalityCard } from "@/components/card/personalityCard";
import { mockAnalysis } from "@/mock";
interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function TwitterAnalysisPage({ params }: PageProps) {
  const { handle } = await params;

  try {
    const twitterService = new TwitterService();
    // const aiService = new AIAnalysisService();

    // 获取推文数据
    const tweetsResult = await twitterService.getUserPost(handle, {
      limit: 20,
      include_replies: false,
      include_pinned: true,
    });

    if (!tweetsResult.success || !tweetsResult.data.data.length) {
      notFound();
    }

    // 从第一条推文中提取用户信息
    const userFromTweet = tweetsResult.data.data[0].user;
    const avatar = await getTwitterHighQualityAvatar(userFromTweet.profile_pic_url);

    // 构建用户信息
    const userDetails: TwitterUser = {
      username: userFromTweet.username,
      display_name: userFromTweet.name,
      profile_image_url: avatar,
      description: userFromTweet.description,
    };

    // // 转换推文为自定义格式
    // const transformedTweets = transformPostsForAI(tweetsResult.data.data);
    // console.log("transformedTweets", transformedTweets);
    // // 获取 推文 分析
    // const tweetsAnalysis = await aiService.analyzeUserTweets(transformedTweets);

    // // 检查分析是否成功
    // if (!tweetsAnalysis.success || !tweetsAnalysis.analysis) {
    //   throw new Error(tweetsAnalysis.error || "Analysis failed");
    // }

    // // 分解AI分析结果并转换为组件需要的类型
    // const analysis = tweetsAnalysis.analysis;

    // // 直接使用AI分析结果
    // const shareCardData = analysis.shareCard;
    // const deepDiveData = analysis.deepDive;
    // const soulFormulaData = analysis.soulFormula;
    const shareCardData = mockAnalysis.shareCard;
    const deepDiveData = mockAnalysis.deepDive;
    const soulFormulaData = mockAnalysis.soulFormula;

    // // 获取 用户 分析
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 px-4 py-28 sm:px-12 md:px-28 md:pt-24 to-purple-50">
        <div className="fixed top-0 left-0 right-0 z-50">
          <DetailNavbar />
        </div>

        <div className="flex-1 flex flex-col pt-24 w-full mx-auto px-4">
          {/* 主标题区域 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              名人匹配结果
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              基于你的表达方式，AI
              为你匹配了相似品味的名人。发现与你内心风格共鸣的"名人灵魂"。
            </p>
          </div>

          {/* 人格分析区域 */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              人格特征分析
            </h3>

            <div className="mb-6">
              <MainCard data={shareCardData} user={userDetails} />
            </div>

            {/* 其他card区域 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 mt-6">
              <div>
                <PersonalityCard data={deepDiveData} user={userDetails} />
              </div>
              <div>
                <DeepMatchCard analysisData={soulFormulaData} user={userDetails} />
              </div>
            </div>

            {/* YouMind 卡片 */}
            <div className="flex flex-col items-center justify-center rounded-2xl p-8 text-white text-center mb-8">
              <YoumindCard />
            </div>

            <div className="flex-1 flex items-center justify-center py-8">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading user data:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DetailNavbar />
        <div className="flex-1 flex items-center justify-center pt-32">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="text-red-600 text-lg font-semibold mb-2">
                分析失败
              </div>
              <p className="text-red-500">
                {error instanceof Error ? error.message : "未知错误"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  // 获取当前域名
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // 动态生成图片 URL，默认使用main类型
  const imageUrl = `${baseUrl}/api/generate-card/${handle}?type=main`;

  return {
    title: `${handle} - Twitter Personality Analysis`,
    description: `AI-powered personality analysis for @${handle} based on Twitter activity patterns`,
    openGraph: {
      title: `${handle} - Twitter Personality Analysis`,
      description: `AI-powered personality analysis for @${handle} based on Twitter activity patterns`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${handle} - Twitter Personality Analysis`,
      description: `AI-powered personality analysis for @${handle} based on Twitter activity patterns`,
      images: [imageUrl],
    },
  };
}
