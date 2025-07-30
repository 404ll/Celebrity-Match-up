import OpenAI from 'openai'
import type { TwitterPost, AIAnalysisResult,AIServiceResult } from '@/types/index'
import { SOUL_MATCHMAKER_PROMPT } from './match-prompt'
import fs from 'fs'
import path from 'path'

interface DatabaseEntry {
  name: string
  username: string
  field: string
  taste_labels: Array<{
    label: string
    definition: string
  }>
}

interface Databases {
  tech_venture: DatabaseEntry[]
  finance_web3: DatabaseEntry[]
  politics: DatabaseEntry[]
}

export class AIAnalysisService {
  private openai: OpenAI
  private databases: Databases | null = null

  constructor() {
    const apiKey = process.env.AIHUBMIX_API_KEY || '';
    
    this.openai = new OpenAI({
      baseURL: 'https://aihubmix.com/v1',
      apiKey: apiKey
    })
  }

  /**
   * 加载所有数据
   */
  private async loadDatabases(): Promise<Databases> {
    if (this.databases) {
      return this.databases
    }

    try {
      // 在 Next.js 中，process.cwd() 指向项目根目录
      const dataPath = path.join(process.cwd(), 'public', 'data')
      
      // 检查文件是否存在
      const techVenturePath = path.join(dataPath, 'tech-venture.json')
      const financeWeb3Path = path.join(dataPath, 'finance-web3.json')
      const politicsPath = path.join(dataPath, 'politics.json')

      if (!fs.existsSync(techVenturePath) || !fs.existsSync(financeWeb3Path) || !fs.existsSync(politicsPath)) {
        throw new Error('One or more database files not found')
      }
      
      // 加载各个领域的数据
      const techVentureData = JSON.parse(
        fs.readFileSync(techVenturePath, 'utf-8')
      ) as DatabaseEntry[]
      
      const financeWeb3Data = JSON.parse(
        fs.readFileSync(financeWeb3Path, 'utf-8')
      ) as DatabaseEntry[]
      
      const politicsData = JSON.parse(
        fs.readFileSync(politicsPath, 'utf-8')
      ) as DatabaseEntry[]

      this.databases = {
        tech_venture: techVentureData,
        finance_web3: financeWeb3Data,
        politics: politicsData
      }

      return this.databases
    } catch (error) {
      console.error('Error loading databases:', error)
      throw new Error(`Failed to load databases: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 分析用户的推文内容并生成品味匹配结果
   */
  async analyzeUserTweets(tweets: TwitterPost[]): Promise<AIServiceResult> {
    try {
      // 验证输入
      if (!tweets || tweets.length === 0) {
        return {
          success: false,
          error: 'No tweets provided for analysis'
        }
      }

      // 自动加载数据库
      const databases = await this.loadDatabases()
      
      // 构建分析提示
      const prompt = this.buildSoulMatchmakerPrompt(tweets, databases)
      
      const completion = await this.openai.chat.completions.create({
        model: 'gemini-2.5-pro',
        messages: [
          {
            "role": 'user',
            "content": prompt
          }
        ],
        response_format: { type: "json_object" }
      })

      const analysisContent = completion.choices[0].message.content
      if (!analysisContent) {
        throw new Error('No response content from AI')
      }

      const analysis = JSON.parse(analysisContent) as AIAnalysisResult

      return {
        success: true,
        analysis
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
   * 构建Soul Matchmaker分析提示
   */
  private buildSoulMatchmakerPrompt(tweets: TwitterPost[], databases: Databases): string {

    const tweetsInfo = JSON.stringify(tweets, null, 2)
    const databasesInfo = JSON.stringify(databases, null, 2)

    return `${SOUL_MATCHMAKER_PROMPT}

# INPUT_USER_TWEETS
${tweetsInfo}

# INPUT_DATABASES
${databasesInfo}

请按照上述步骤进行分析，并返回符合OUTPUT_JSON_STRUCTURE格式的JSON结果。
`
  }
}