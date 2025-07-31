import "server-only"
import type {  ServiceResult, RawTwitterPost, PaginatedResult } from "@/types/rawTwitter"
import https from 'https'

export class TwitterService {
  private apiKey: string
  private host = process.env.TWITTER_API_HOST

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || ''
  }

  async getUserPost(username: string, options?: {
    limit?: number
    user_id?: string
    include_replies?: boolean
    include_pinned?: boolean
    continuation_token?: string
  }): Promise<ServiceResult<PaginatedResult<RawTwitterPost>>> {
    const cleanUsername = username.replace(/^@+/, "")
    
    // 构建查询参数 - 按照RapidAPI示例的格式
    const params = new URLSearchParams({
      username: cleanUsername,
      limit: (options?.limit || 40).toString(),
      include_replies: (options?.include_replies ?? false).toString(),
      include_pinned: (options?.include_pinned ?? false).toString()
    })
    
    // 如果有user_id，添加到参数中
    if (options?.user_id) {
      params.set('user_id', options.user_id)
    }
    
    // 如果有continuation_token，添加到参数中
    if (options?.continuation_token) {
      params.set('continuation_token', options.continuation_token)
    }

    return new Promise((resolve) => {
      //构造请求参数
      const requestOptions = {
        hostname: this.host,
        path: `/user/tweets?${params.toString()}`,
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.host
        }
      }

      // 发送请求
      const req = https.request(requestOptions, (res) => {
        let data = ''
        // 获取数据
        res.on('data', (chunk) => {
          data += chunk
        })
        // 数据获取完毕
        res.on('end', () => {
          // 请求成功
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const jsonData = JSON.parse(data)
              // 客户端限制：确保不超过请求的limit
              const requestedLimit = options?.limit || 40;
              const limitedResults = jsonData.results?.slice(0, requestedLimit) || [];
              resolve({
                // 请求成功
                success: true,
                data: {
                  data: limitedResults,
                  continuation_token: jsonData.continuation_token,
                  total_count: limitedResults.length
                }
              })
            } catch (parseError) {
              // 解析错误
              console.error("JSON parse error:", parseError)
              resolve({
                success: false,
                error: "Failed to parse response"
              })
            }
          } else {
            // 请求失败
            resolve({
              success: false,
              error: `HTTP ${res.statusCode}: ${data}`
            })
          }
        })
      })

      req.on('error', (error) => {
        // 请求错误
        resolve({
          success: false,
          error: error.message
        })
      })

      req.end()
    })
  }

}