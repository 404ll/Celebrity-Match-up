import { Brain, Database, Sparkles, Users, Zap } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface AnalysisLoadingProps {
  status: AnalysisStatus;
  formatTime: (seconds: number) => string;
}

export const AnalysisLoading = ({ status, formatTime }: AnalysisLoadingProps) => {
  // 根据当前步骤获取对应的描述和图标
  const getStepInfo = (stepId: string) => {
    const currentStep = status.currentStep;

    switch (stepId) {
      case 'tweets-fetching':
        return {
          title: '获取推文',
          icon: Users,
          color: 'blue',
          isActive: currentStep === 'tweets-fetching',
          isCompleted: ['field-analysis', 'database-loading', 'ai-analysis', 'complete'].includes(
            currentStep,
          ),
        };
      case 'field-analysis':
        return {
          title: '领域分析',
          icon: Brain,
          color: 'purple',
          isActive: currentStep === 'field-analysis',
          isCompleted: ['database-loading', 'ai-analysis', 'complete'].includes(currentStep),
        };
      case 'database-loading':
        return {
          title: '加载数据',
          icon: Database,
          color: 'green',
          isActive: currentStep === 'database-loading',
          isCompleted: ['ai-analysis', 'complete'].includes(currentStep),
        };
      case 'ai-analysis':
        return {
          title: 'AI分析',
          icon: Zap,
          color: 'orange',
          isActive: currentStep === 'ai-analysis',
          isCompleted: ['complete'].includes(currentStep),
        };
      case 'complete':
        return {
          title: '完成',
          icon: Sparkles,
          color: 'emerald',
          isActive: currentStep === 'complete',
          isCompleted: currentStep === 'complete',
        };
      default:
        return {
          title: '处理中',
          icon: Sparkles,
          color: 'blue',
          isActive: false,
          isCompleted: false,
        };
    }
  };

  const steps = [
    'tweets-fetching',
    'field-analysis',
    'database-loading',
    'ai-analysis',
    'complete',
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50">
      {/* 当前状态显示 */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full border-2 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-blue-600" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-800">
              {status.currentStep === 'complete' ? '分析完成' : '正在分析...'}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {status.message || '正在为您生成个性化分析...'}
            </p>
          </div>
        </div>
      </div>

      {/* 简化的进度指示器 */}
      <div className="flex items-center justify-between">
        {steps.map((stepId, index) => {
          const stepInfo = getStepInfo(stepId);
          const IconComponent = stepInfo.icon;
          const isActive = stepInfo.isActive;
          const isCompleted = stepInfo.isCompleted;

          return (
            <div key={stepId} className="flex items-center">
              {/* 步骤指示器 */}
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  {isCompleted ? (
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  ) : isActive ? (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                <IconComponent
                  className={`w-3 h-3 ${
                    isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs ${
                    isCompleted ? 'text-emerald-700' : isActive ? 'text-blue-700' : 'text-gray-500'
                  }`}
                >
                  {stepInfo.title}
                </span>
              </div>

              {/* 连接线 */}
              {index < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-2"></div>}
            </div>
          );
        })}
      </div>

      {/* 提示信息 */}
      {status.currentStep !== 'complete' && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-700">请耐心等待，AI正在为您生成个性化分析...</span>
          </div>
        </div>
      )}
    </div>
  );
};
