import OpenAI from "openai";
import type {
  TwitterPost,
  AIAnalysisResult,
  AIServiceResult,
  UserFieldResult,
} from "@/types/index";
import { SOUL_MATCHMAKER_PROMPT } from "./match-prompt";
import { USER_FIELD_PROMPT } from "./field-prompt";
import fs from "fs";
import path from "path";
import { UserInfo } from "@/types/index";

interface DatabaseEntry {
  name: string;
  username: string;
  field: string;
  taste_labels: Array<{
    label: string;
    definition: string;
  }>;
}

interface Databases {
  [key: string]: DatabaseEntry[];
}

export class AIAnalysisService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.AIHUBMIX_API_KEY || "";

    this.openai = new OpenAI({
      baseURL: "https://aihubmix.com/v1",
      apiKey: apiKey,
    });
  }

  /**
   * 根据用户领域标签加载对应的数据库
   */
  private async loadDatabasesByTags(tags: string[]): Promise<Databases> {
    const databases: Databases = {};
    
    try {
      const dataPath = path.join(process.cwd(), 'public', 'data');
      
      for (const tag of tags) {
        const filePath = path.join(dataPath, `${tag}.json`);
        
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as DatabaseEntry[];
          databases[tag] = data;
          console.log(`✅ 加载数据库: ${tag} (${data.length} 条记录)`);
        } else {
          console.warn(`⚠️  数据库文件不存在: ${tag}.json`);
        }
      }
      
      return databases;
    } catch (error) {
      console.error('加载数据库失败:', error);
      throw new Error(`Failed to load databases: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 根据用户领域分析结果进行推文分析
   */
async analyzeUserTweetsWithFieldAnalysis(
    userInfo: UserInfo
  ): Promise<AIServiceResult> {
    try {

      // 1. 先分析用户领域
      //切割前10条推文，用于用户领域分析
      const tweets = userInfo.tweets.slice(0, 10);
      const userInfoForFieldAnalysis = {
        ...userInfo,
        tweets: tweets,
      };
      console.log("领域分析推文长度", userInfoForFieldAnalysis.tweets.length);
      const fieldResult = await this.analyzeUserField(userInfoForFieldAnalysis);
      console.log('用户领域分析结果:', fieldResult);
      
      if (!fieldResult.domains || !Array.isArray(fieldResult.domains)) {
        return {
          success: false,
          error: '用户领域分析失败或结果格式错误'
        };
      }
      
      // 2. 根据领域标签加载对应的数据库
      const databases = await this.loadDatabasesByTags(fieldResult.domains);
      
      if (Object.keys(databases).length === 0) {
        return {
          success: false,
          error: '没有找到对应的数据库文件'
        };
      }
      console.log("databases 长度", Object.keys(databases).length);
      
      // 3. 进行推文分析
      return await this.analyzeUserTweets(userInfo.tweets, databases);
      
    } catch (error) {
      console.error('分析失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '分析失败'
      };
    }
  }

  /**
   * 分析用户的推文内容并生成品味匹配结果
   */
  private async analyzeUserTweets(
    tweets: TwitterPost[],
    databases: Databases
  ): Promise<AIServiceResult> {
    try {
      // 验证输入
      if (!tweets || tweets.length === 0) {
        return {
          success: false,
          error: "No tweets provided for analysis",
        };
      }

      // 构建分析提示
      const prompt = this.buildSoulMatchmakerPrompt(tweets, databases);

      const completion = await this.openai.chat.completions.create({
        model: "gemini-2.5-pro",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const analysisContent = completion.choices[0].message.content;
      if (!analysisContent) {
        throw new Error("No response content from AI");
      }

      const analysis = JSON.parse(analysisContent) as AIAnalysisResult;

      return {
        success: true,
        analysis,
      };
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "AI analysis failed",
      };
    }
  }

  private  async analyzeUserField(userInfo: UserInfo): Promise<any> {
    const prompt = this.buildUserFieldPrompt(userInfo);
    const completion = await this.openai.chat.completions.create({
      model: "gemini-2.5-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const analysisContent = completion.choices[0].message.content;
    if (!analysisContent) {
      throw new Error("No response content from AI");
    }

    const analysis = JSON.parse(analysisContent) as UserFieldResult;
    console.log("analysis", analysis);
    return analysis;
  }

  /**
   * 构建Soul Matchmaker分析提示
   */
  private buildSoulMatchmakerPrompt(
    tweets: TwitterPost[],
    databases: Databases
  ): string {
    const tweetsInfo = JSON.stringify(tweets, null, 2);
    const databasesInfo = JSON.stringify(databases, null, 2);

    return `${SOUL_MATCHMAKER_PROMPT}

# INPUT_USER_TWEETS
${tweetsInfo}

# INPUT_DATABASES
${databasesInfo}

请按照上述步骤进行分析，并返回符合OUTPUT_JSON_STRUCTURE格式的JSON结果。
`;
  }

  /**
   * 构建用户领域分析提示
   */
  private buildUserFieldPrompt(userInfo: UserInfo): string {
    const userInfoJson = JSON.stringify(userInfo, null, 2);

    return `${USER_FIELD_PROMPT}

请分析以下用户信息：

# INPUT_USER_INFO
${userInfoJson}

请返回JSON格式的结果，包含选中的领域标签数组。
`;
  }
}
