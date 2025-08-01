import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { DetailNavbar } from "@/components/navbar/detailNavbar";
import { YoumindCard } from "@/components/card/YoumindCard";
import { TwitterService } from "@/lib/twitter-service";
import { transformPostsForAI } from "@/utils/twitter-transformer";
import { getTwitterHighQualityAvatar } from "@/lib/utils";
import { notFound } from "next/navigation";
import { LaunchCard } from "@/components/card/LaunchCard";
import { TwitterUser, UserInfo } from "@/types/index";
import { SoulFormulaCard } from "@/components/card/SoulFormulaCard";
import { GrowthCard } from "@/components/card/GrowthCard";
// import { mockAnalysis, mockUser } from "@/mock";
import { AIAnalysisService } from "@/lib/ai-analysis-service";
import { generateTwitterAnalysisMetadata } from "@/utils/metadata-utils";
interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return generateTwitterAnalysisMetadata({ handle });
}

export default async function TwitterAnalysisPage({ params }: PageProps) {
  const { handle } = await params;

  try {
    const twitterService = new TwitterService();
    const aiService = new AIAnalysisService();

    // 获取推文数据
    const tweetsResult = await twitterService.getUserPost(handle, {
      limit: 40,
      include_replies: false,
      include_pinned: true,
    });

    if (!tweetsResult.success || !tweetsResult.data.data.length) {
      notFound();
    }

    // 从第一条推文中提取用户信息
    const userFromTweet = tweetsResult.data.data[0].user;
    //头像高清化
    const avatar = getTwitterHighQualityAvatar(userFromTweet.profile_pic_url);

    // 构建用户信息
    const userDetails: TwitterUser = {
      username: userFromTweet.username,
      display_name: userFromTweet.name,
      profile_image_url: avatar,
      description: userFromTweet.description,
    };

    // 转换推文为自定义格式
    const transformedTweets = transformPostsForAI(tweetsResult.data.data);

    const userinfo: UserInfo = {
      description: userFromTweet.description,
      tweets: transformedTweets,
    };

    // 获取 推文 分析
    const tweetsAnalysis = await aiService.analyzeUserTweetsWithFieldAnalysis(userinfo);

    console.log("终极分析结果", tweetsAnalysis);
    // 检查分析是否成功
    if (!tweetsAnalysis.success || !tweetsAnalysis.analysis) {
      throw new Error(tweetsAnalysis.error || "Analysis failed");
    }

    // 分解AI分析结果并转换为组件需要的类型
    const analysis = tweetsAnalysis.analysis;

    // 直接使用AI分析结果
    const launchCardData = analysis.LaunchCard;
    const growthCardData = analysis.GrowthCard;
    const soulFormulaData = analysis.SoulFormula;

    // const launchCardData = mockAnalysis.LaunchCard;
    // const growthCardData = mockAnalysis.GrowthCard;
    // const soulFormulaData = mockAnalysis.SoulFormula;
    // const userDetails = mockUser;

    // // 获取 用户 分析
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 px-4 py-12 sm:px-12 md:px-28 md:pt-24 to-purple-50">
        <div className="fixed top-0 left-0 right-0 z-50">
          <DetailNavbar />
        </div>

        <div className="flex-1 flex flex-col pt-24 w-full mx-auto px-4">
          {/* 主标题区域 */}
          <div className="text-center mb-12 relative">
            {/* 装饰性背景元素 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
            </div>
            
            
            {/* 主标题 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                名人匹配
              </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                结果
              </span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              基于你的表达方式，AI为你匹配了相似品味的名人。
              <br className="hidden sm:block" />
              发现与你内心风格共鸣的"名人灵魂"。
            </p>
            
            {/* 装饰性分隔线 */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
            
          </div>

          {/* 人格分析区域 */}
          <div className="border-t border-gray-100 pt-4 max-w-6xl mx-auto">

            <div className="mb-12">
              <div>
                <SoulFormulaCard
                  analysisData={soulFormulaData}
                  user={userDetails}
                />
              </div>
            </div>

            {/* 其他card区域 */}
            <div className="flex flex-col gap-12 mb-6 mt-6">
              <LaunchCard data={launchCardData} user={userDetails} />
              <GrowthCard data={growthCardData} user={userDetails} />
            </div>

            {/* YouMind 卡片 */}
            <div className="flex flex-col items-center justify-center rounded-2xl p-8 text-white text-center mb-8">
              <YoumindCard />
            </div>

            <div className="w-full border-t border-gray-300 mt-8"></div>

            <div className="flex-1 flex items-center justify-center">
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


