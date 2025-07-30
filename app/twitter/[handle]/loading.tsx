import { DetailNavbar } from "@/components/navbar/detailNavbar";

export default function Loading() {
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

        {/* Loading 区域 */}
        <div className="border-t border-gray-100 pt-4">
          <div className="text-center py-20">
            {/* 旋转的加载图标 */}
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>
            
            {/* Loading 文字 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                AI正在分析你的推文...
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                正在深度分析你的表达方式，匹配相似品味的名人，这可能需要几秒钟时间
              </p>
              
              {/* 进度提示 */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>获取推文数据</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>AI分析中</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>生成匹配结果</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 