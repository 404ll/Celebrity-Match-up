import { Metadata } from "next";
import { Footer } from "@/components/footer";
import { DetailNavbar } from "@/components/navbar/detailNavbar";
import { YoumindCard } from "@/components/card/youmindCard";
import { TwitterService } from "@/lib/twitter-service";
import { TwitterTransformer } from "@/utils/twitter-transformer";
import { AIAnalysisService } from "@/lib/ai-analysis-service";
import { getTwitterHighQualityAvatar } from "@/lib/utils";
import { notFound } from "next/navigation";
import { MainCard } from "@/components/card/mainCard";
import {
  DeepMatchCardData,
  MainCardData,
  PersonalityCardData,
} from "@/types/index";
import { DeepMatchCard } from "@/components/card/deepMatch";
import { PersonalityCard } from "@/components/card/personalityCard";

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function TwitterAnalysisPage({ params }: PageProps) {
  const { handle } = await params;

  try {
    // const twitterService = new TwitterService();
    // const aiService = new AIAnalysisService();

    // // 获取推文数据
    // const tweetsResult = await twitterService.getUserPost(handle, {
    //   limit: 20,
    //   include_replies: false,
    //   include_pinned: true
    // });

    // if (!tweetsResult.success || !tweetsResult.data.data.length) {
    //   notFound();
    // }

    // // 从第一条推文中提取用户信息
    // const userFromTweet = tweetsResult.data.data[0].user;

    // // 转换推文为自定义格式
    // const transformedTweets = TwitterTransformer.transformPostsForAI(tweetsResult.data.data);

    // // 构建用户信息
    // const userDetails = {
    //   username: userFromTweet.username,
    //   display_name: userFromTweet.name,
    //   profile_image_url: userFromTweet.profile_pic_url,
    //   followers_count: userFromTweet.follower_count,
    //   following_count: userFromTweet.following_count,
    //   tweet_count: userFromTweet.number_of_tweets,
    //   description: userFromTweet.description,
    //   verified: userFromTweet.is_verified || userFromTweet.is_blue_verified
    // };

    const mockData: MainCardData = {
      id: handle, // 使用handle作为ID
      name: handle, // 使用handle作为用户名
      image: `/api/avatar/${handle}`, // 使用动态头像
      analysis: `这是 @${handle} 的 Twitter 个性分析, 由 AI 代理生成, 基于 @youmind_ai #personalityanalysis`,
    };
    const mockData1: PersonalityCardData = {
      id: handle,
      name: handle,
      image: `/api/avatar/${handle}`,
      personality: `这是 @${handle} 的人格特征分析, 基于其 Twitter 活动模式`,
    };
    const mockData2: DeepMatchCardData = {
      name: handle,
      image: `/api/avatar/${handle}`,
      deepMatch: `这是 @${handle} 的深度匹配分析, 发现相似品味的名人`,
    };
    // // 获取 推文 分析
    // const tweetsAnalysis = await aiService.analyzeUserTweets(userDetails, transformedTweets);
    // console.log("tweetsAnalysis success:", tweetsAnalysis.success);
    // console.log("tweetsAnalysis error:", tweetsAnalysis.error);

    // // 获取 用户 分析
    // const userAnalysis = await aiService.generateUserProfile(userDetails, transformedTweets);
    // console.log("userAnalysis success:", userAnalysis.success);
    // console.log("userAnalysis error:", userAnalysis.error);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="fixed top-0 left-0 right-0 z-50">
          <DetailNavbar />
        </div>

        <div className="flex-1 flex flex-col pt-24 max-w-4xl mx-auto px-4">
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

            {/* <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">表达风格</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    基于你的推文内容和互动模式，你的表达风格偏向于 {userDetails.description?.length > 50 ? '深度思考型' : '简洁直接型'}。
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <h4 className="font-semibold text-purple-900 mb-3">内容偏好</h4>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    你的内容创作倾向于 {userDetails.followers_count > 10000 ? '影响力导向' : '个人表达导向'}，注重与受众的深度连接。
                  </p>
                </div>
              </div> */}

            <div className="mb-6">
              <MainCard data={mockData} />
            </div>

            {/* 其他card区域 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 mt-6">
              <div>
                <PersonalityCard data={mockData1} />
              </div>
              <div>
                <DeepMatchCard data={mockData2} />
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

  // 添加调试信息
  console.log("Vercel URL:", process.env.VERCEL_URL);
  console.log("Base URL:", baseUrl);
  console.log("Handle:", handle);
  console.log("Image URL:", imageUrl);

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
// elemen@Mac growth % curl -A Twitterbot "https://growth-nfdeug9g7-elemens-projects.vercel.app/twitter/elemen_8"

// <!DOCTYPE html><html id="__next_error__"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-82ea73ad9d30f1b7.js"/><script src="/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js" async=""></script><script src="/_next/static/chunks/964-c3e49cf7341645bb.js" async=""></script><script src="/_next/static/chunks/main-app-0f20f4d91de0a5c5.js" async=""></script><meta name="robots" content="noindex"/><meta name="next-size-adjust" content=""/><title>elemen_8 - Twitter Personality Analysis</title><meta name="description" content="AI-powered personality analysis for @elemen_8 based on Twitter activity patterns"/><meta property="og:title" content="elemen_8 - Twitter Personality Analysis"/><meta property="og:description" content="AI-powered personality analysis for @elemen_8 based on Twitter activity patterns"/><meta property="og:image" content="https://growth-nfdeug9g7-elemens-projects.vercel.app/api/generate-card/elemen_8"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
// <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/><script src="/_next/static/chunks/polyfills-42372ed130431b0a.js" noModule=""></script></head><body><script src="/_next/static/chunks/webpack-82ea73ad9d30f1b7.js" id="_R_" async=""></script><script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,"1:\"$Sreact.fragment\"\n2:I[7555,[],\"\"]\n3:I[1295,[],\"\"]\n5:I[9665,[],\"OutletBoundary\"]\n8:I[9665,[],\"ViewportBoundary\"]\na:I[9665,[],\"MetadataBoundary\"]\nc:I[8393,[],\"\"]\nd:I[737,[\"826\",\"static/chunks/826-122307d664755cd5.js\",\"126\",\"static/chunks/126-868a6e7404769a87.js\",\"557\",\"static/chunks/app/twitter/%5Bhandle%5D/page-892a3eb5844dd855.js\"],\"DetailNavbar\"]\ne:I[3209,[\"826\",\"static/chunks/826-122307d664755cd5.js\",\"126\",\"static/chunks/126-868a6e7404769a87.js\",\"557\",\"static/chunks/app/twitter/%5Bhandle%5D/page-892a3eb5844dd855.js\"],\"MainCard\"]\nf:I[3638,[\"826\",\"static/chunks/826-122307d664755cd5.js\",\"126\",\"static/chunks/126-868a6e7404769a87.js\",\"557\",\"static/chunks/app/twitter/%5Bhandle%5D/page-892a3eb5844dd855.js\"],\"PersonalityCard\"]\n10:I[9253,[\"826\",\"static/chunks/826-122307d664755cd5.js\",\"126\",\"static/chunks/126-868a6e7404769a87.js\",\"557\",\"static/chunks/app/twitter/%5Bhandle%5D/page-892a3eb5844dd855.js\"],\"DeepMatchCard\"]\n11:I[4964,[\"826\",\"static/chunks/826-122307d664755cd5.js\",\"126\",\"static/chunks/126-868a6e7404769a87.js\",\"557\",\"static/chunks/app/twitter/%5Bhandle%5D/page-892a3eb5844dd855.js\"],\"YoumindCard\"]\n12:I[8175,[],\"IconMark\"]\n:HL[\"/_next/static/media/569ce4b8f30dc480-s.p.woff2\",\"font\",{\"crossOrigin\":\"\",\"type\":\"font/woff2\"}]\n:HL[\"/_next/static/media/93f479601ee12b01-s.p.woff2\",\"font\",{\"crossOrigin\":\"\",\"type\":\"font/woff2\"}]\n:HL[\"/_next/static/css/cf0193bf667a18bf.css\",\"style\"]\n"])</script><script>self.__next_f.push([1,"0:{\"P\":null,\"b\":\"_s_il3MIn8Pff9T1zj1s_\",\"p\":\"\",\"c\":[\"\",\"twitter\",\"elemen_8\"],\"i\":false,\"f\":[[[\"\",{\"children\":[\"twitter\",{\"children\":[[\"handle\",\"elemen_8\",\"d\"],{\"children\":[\"__PAGE__\",{}]}]}]},\"$undefined\",\"$undefined\",true],[\"\",[\"$\",\"$1\",\"c\",{\"children\":[[[\"$\",\"link\",\"0\",{\"rel\":\"stylesheet\",\"href\":\"/_next/static/css/cf0193bf667a18bf.css\",\"precedence\":\"next\",\"crossOrigin\":\"$undefined\",\"nonce\":\"$undefined\"}]],[\"$\",\"html\",null,{\"lang\":\"en\",\"children\":[\"$\",\"body\",null,{\"className\":\"__variable_5cfdac __variable_9a8899 antialiased\",\"children\":[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L3\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":[[[\"$\",\"title\",null,{\"children\":\"404: This page could not be found.\"}],[\"$\",\"div\",null,{\"style\":{\"fontFamily\":\"system-ui,\\\"Segoe UI\\\",Roboto,Helvetica,Arial,sans-serif,\\\"Apple Color Emoji\\\",\\\"Segoe UI Emoji\\\"\",\"height\":\"100vh\",\"textAlign\":\"center\",\"display\":\"flex\",\"flexDirection\":\"column\",\"alignItems\":\"center\",\"justifyContent\":\"center\"},\"children\":[\"$\",\"div\",null,{\"children\":[[\"$\",\"style\",null,{\"dangerouslySetInnerHTML\":{\"__html\":\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\"}}],[\"$\",\"h1\",null,{\"className\":\"next-error-h1\",\"style\":{\"display\":\"inline-block\",\"margin\":\"0 20px 0 0\",\"padding\":\"0 23px 0 0\",\"fontSize\":24,\"fontWeight\":500,\"verticalAlign\":\"top\",\"lineHeight\":\"49px\"},\"children\":404}],[\"$\",\"div\",null,{\"style\":{\"display\":\"inline-block\"},\"children\":[\"$\",\"h2\",null,{\"style\":{\"fontSize\":14,\"fontWeight\":400,\"lineHeight\":\"49px\",\"margin\":0},\"children\":\"This page could not be found.\"}]}]]}]}]],[]],\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\",\"gracefullyDegrade\":true}]}]}]]}],{\"children\":[\"twitter\",[\"$\",\"$1\",\"c\",{\"children\":[null,[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L3\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":\"$undefined\",\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\",\"gracefullyDegrade\":true}]]}],{\"children\":[[\"handle\",\"elemen_8\",\"d\"],[\"$\",\"$1\",\"c\",{\"children\":[null,[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L3\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":\"$undefined\",\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\",\"gracefullyDegrade\":true}]]}],{\"children\":[\"__PAGE__\",[\"$\",\"$1\",\"c\",{\"children\":[\"$L4\",null,[\"$\",\"$L5\",null,{\"children\":[\"$L6\",\"$L7\"]}]]}],{},null,false]},null,false]},null,false],[\"$\",\"$1\",\"h\",{\"children\":[null,[[\"$\",\"$L8\",null,{\"children\":\"$L9\"}],[\"$\",\"meta\",null,{\"name\":\"next-size-adjust\",\"content\":\"\"}]],[\"$\",\"$La\",null,{\"children\":\"$Lb\"}]]}],false]],\"m\":\"$undefined\",\"G\":[\"$c\",[]],\"s\":false,\"S\":false}\n"])</script><script>self.__next_f.push([1,"4:[\"$\",\"div\",null,{\"className\":\"min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50\",\"children\":[[\"$\",\"div\",null,{\"className\":\"fixed top-0 left-0 right-0 z-50\",\"children\":[\"$\",\"$Ld\",null,{}]}],[\"$\",\"div\",null,{\"className\":\"flex-1 flex flex-col pt-24 max-w-4xl mx-auto px-4\",\"children\":[[\"$\",\"div\",null,{\"className\":\"text-center mb-12\",\"children\":[[\"$\",\"h1\",null,{\"className\":\"text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4\",\"children\":\"名人匹配结果\"}],[\"$\",\"p\",null,{\"className\":\"text-gray-600 text-lg max-w-2xl mx-auto\",\"children\":\"基于你的表达方式，AI 为你匹配了相似品味的名人。发现与你内心风格共鸣的\\\"名人灵魂\\\"。\"}]]}],[\"$\",\"div\",null,{\"className\":\"border-t border-gray-100 pt-4\",\"children\":[[\"$\",\"h3\",null,{\"className\":\"text-xl font-bold text-gray-900 mb-6 text-center\",\"children\":\"人格特征分析\"}],[\"$\",\"div\",null,{\"className\":\"mb-6\",\"children\":[\"$\",\"$Le\",null,{\"data\":{\"id\":\"elemen_8\",\"name\":\"elemen_8\",\"image\":\"/api/avatar/elemen_8\",\"analysis\":\"这是 @elemen_8 的 Twitter 个性分析, 由 AI 代理生成, 基于 @youmind_ai #personalityanalysis\"}}]}],[\"$\",\"div\",null,{\"className\":\"grid md:grid-cols-2 gap-6 mb-6 mt-6\",\"children\":[[\"$\",\"div\",null,{\"children\":[\"$\",\"$Lf\",null,{\"data\":{\"id\":\"elemen_8\",\"name\":\"elemen_8\",\"image\":\"/api/avatar/elemen_8\",\"personality\":\"这是 @elemen_8 的人格特征分析, 基于其 Twitter 活动模式\"}}]}],[\"$\",\"div\",null,{\"children\":[\"$\",\"$L10\",null,{\"data\":{\"name\":\"elemen_8\",\"image\":\"/api/avatar/elemen_8\",\"deepMatch\":\"这是 @elemen_8 的深度匹配分析, 发现相似品味的名人\"}}]}]]}],[\"$\",\"div\",null,{\"className\":\"flex flex-col items-center justify-center rounded-2xl p-8 text-white text-center mb-8\",\"children\":[\"$\",\"$L11\",null,{}]}],[\"$\",\"div\",null,{\"className\":\"flex-1 flex items-center justify-center py-8\",\"children\":[\"$\",\"div\",null,{\"className\":\"flex flex-col items-center justify-center w-full\",\"children\":[\"$\",\"h1\",null,{\"className\":\"text-sm text-gray-600 mb-4 mt-4\",\"children\":\"© 2025 YouMind.\"}]}]}]}]]}]]}]\n"])</script><script>self.__next_f.push([1,"9:[[\"$\",\"meta\",\"0\",{\"charSet\":\"utf-8\"}],[\"$\",\"meta\",\"1\",{\"name\":\"viewport\",\"content\":\"width=device-width, initial-scale=1\"}]]\n6:null\n7:null\n"])</script><script>self.__next_f.push([1,"b:[[\"$\",\"title\",\"0\",{\"children\":\"elemen_8 - Twitter Personality Analysis\"}],[\"$\",\"meta\",\"1\",{\"name\":\"description\",\"content\":\"AI-powered personality analysis for @elemen_8 based on Twitter activity patterns\"}],[\"$\",\"meta\",\"2\",{\"property\":\"og:title\",\"content\":\"elemen_8 - Twitter Personality Analysis\"}],[\"$\",\"meta\",\"3\",{\"property\":\"og:description\",\"content\":\"AI-powered personality analysis for @elemen_8 based on Twitter activity patterns\"}],[\"$\",\"meta\",\"4\",{\"property\":\"og:image\",\"content\":\"https://growth-nfdeug9g7-elemens-projects.vercel.app/api/generate-card/elemen_8\"}],[\"$\",\"meta\",\"5\",{\"property\":\"og:image:width\",\"content\":\"1200\"}],[\"$\",\"meta\",\"6\",{\"property\":\"og:image:height\",\"content\":\"630\"}],[\"$\",\"meta\",\"7\",{\"name\":\"twitter:card\",\"content\":\"summary_large_image\"}],[\"$\",\"meta\",\"8\",{\"name\":\"twitter:title\",\"content\":\"elemen_8 - Twitter Personality Analysis\"}],[\"$\",\"meta\",\"9\",{\"name\":\"twitter:description\",\"content\":\"AI-powered personality analysis for @elemen_8 based on Twitter activity patterns\"}],[\"$\",\"meta\",\"10\",{\"name\":\"twitter:image\",\"content\":\"https://growth-nfdeug9g7-elemens-projects.vercel.app/api/generate-card/elemen_8\"}],[\"$\",\"link\",\"11\",{\"rel\":\"icon\",\"href\":\"/favicon.ico\",\"type\":\"image/x-icon\",\"sizes\":\"16x16\"}],[\"$\",\"$L12\",\"12\",{}]]\n"])</script></body></html>%
// elemen@Mac growth %

