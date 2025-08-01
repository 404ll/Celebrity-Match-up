import { DetailNavbar } from "@/components/navbar/detailNavbar"
import { Brain, Sparkles, Users } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Fixed navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80 border-b border-white/20">
        <DetailNavbar />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen pt-20">
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

          {/* Loading 区域 */}
          <div className="flex justify-center mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/50 max-w-2xl w-full">
              {/* 主要加载动画 */}
              <div className="text-center mb-12">
                {/* 多层旋转加载器 */}
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                    {/* 外圈 */}
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    {/* 旋转的渐变圈 */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"></div>
                    {/* 内圈装饰 */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Loading 文字 */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">AI 正在分析你的推文...</h2>
                  <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                    正在深度分析你的表达方式，匹配相似品味的名人，这可能需要几秒钟时间
                  </p>
                </div>
              </div>

              {/* 进度指示器 */}
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">分析进度</h3>
                </div>

                {/* 进度步骤 */}
                <div className="space-y-4">
                  {/* 步骤1 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-blue-800 font-medium">获取推文数据</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>

                  {/* 步骤2 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-purple-800 font-medium">AI 深度分析</span>
                    </div>
                    <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                  </div>

                  {/* 步骤3 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-green-800 font-medium">生成匹配结果</span>
                    </div>
                    <Users className="w-5 h-5 text-green-600 animate-pulse" />
                  </div>
                </div>
               
                {/* 提示信息 */}
                <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">提示：我们正在分析你的语言风格、情感表达和个性特征</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
