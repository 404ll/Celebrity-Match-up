import 'dotenv/config';
import OpenAI from 'openai';

async function testOptimizedAI() {
  const apiKey = process.env.AIHUBMIX_API_KEY;
  console.log('API Key length:', apiKey?.length || 0);

  if (!apiKey) {
    console.error('❌ AIHUBMIX_API_KEY environment variable is not set');
    return;
  }

  const openai = new OpenAI({
    baseURL: 'https://aihubmix.com/v1',
    apiKey: apiKey
  });

  try {
    console.log('🔄 Testing optimized AI analysis...');
    
    // 测试用户画像生成
    const profilePrompt = `
基于以下 Twitter 用户数据，生成一个生动、具体且富有洞察力的用户画像：

用户基本信息：
- 用户名：elemen_7
- 显示名：Elemen
- 粉丝数：58
- 关注数：118
- 简介：区块链和科技爱好者

推文样本（共 5 条）：
1. 今天学习了新的区块链技术
2. 分享一个有趣的金融科技项目
3. 探讨去中心化应用的发展前景
4. 分析加密货币市场趋势
5. 推荐一些优质的科技资源

请生成一个详细的用户画像，要求：

1. **职业身份推测**：基于推文内容和互动模式，推测用户的职业背景和专业领域

2. **兴趣领域分析**：识别用户最关注的领域和话题，分析其专业深度

3. **性格特点描绘**：用生动的比喻和描述来刻画用户的性格特征，比如"像数字宇宙中的宇航员"这样的表达

4. **表达风格分析**：分析用户的语言特点、表达方式和沟通风格

5. **影响力评估**：评估用户在特定领域的专业影响力和社交影响力

6. **未来潜力预测**：基于当前表现，预测用户的发展潜力和可能的方向

请用中文回答，语言要生动形象，富有洞察力，避免空洞的套话。可以参考这样的表达风格：
"你热衷于区块链和金融科技的探索，永远在寻找提升效率的最佳路径。就像是在数字宇宙中穿梭的宇航员，跃过传统界限，与新兴平台一起构建未来。每当你发声，无不让人感受到时代的脉搏，仿佛是引领者般的存在，真是科技界的金字塔尖！"

请生成一个类似风格的、针对这个用户的独特画像。
`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-pro',
      messages: [
        {
          role: 'user',
          content: profilePrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    console.log('✅ Optimized AI analysis successful!');
    console.log('Generated profile:');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ Optimized AI analysis failed:');
    console.error('Error:', error.message);
  }
}

testOptimizedAI(); 