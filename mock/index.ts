// growth/mock/index.ts - 更新后的mock数据

import { AIAnalysisResult, TwitterUser } from "@/types";

export const mockAnalysis: AIAnalysisResult = {
  shareCard: {
    title: "你的灵魂代码：理想主义Builder的Web3蓝图",
    personaBreakdown: [
      {
        percentage: 45,
        name: "Hayden Adams",
        contribution: "从个人痛点出发，用代码硬磕出解决方案。"
      },
      {
        percentage: 35,
        name: "Vitalik Buterin",
        contribution: "超越代码执行，思考系统背后的价值与哲学。"
      },
      {
        percentage: 20,
        name: "Anatoly Yakovenko",
        contribution: "从第一性原理出发，追求极致的系统性能与效率。"
      }
    ],
    summaryTitle: "从'无头苍蝇'到'理想构造家'",
    summaryBody: "你正走在一条典型的Web3成长之路上：从初入校园的迷茫，到投身黑客松和社区的坚定。你渴望的不是用AI跑几个demo，而是真正'拆解'和'创造'一个完整的产品。这种脚踏实地的学习心态和对行业现状的清醒反思，是你最宝贵的资产。",
    finalIdentity: "脚踏实地的Web3理想构造家"
  },

  deepDive: {
    points: [
      {
        title: "代码不只是Demo，是产品哲学",
        body: "你很早就意识到，能跑起来的小demo没有意义，真正的成长在于'拆解'和'维护'一个完整的产品逻辑。这说明你天生就具备产品思维，追求的不是浅尝辄止的'创造'，而是深入骨髓的'构建'。"
      },
      {
        title: "社区，不是背景板而是充电桩",
        body: "你大量的时间线都与CUITBCA和各种Web3社区活动绑定。对你而言，社区不是履历上的点缀，而是知识和能量的核心来源。你在这里找到同路人，也在这里完成了从学生到Builder的身份认同。"
      },
      {
        title: "锐利的自省，拒绝沦为叙事燃料",
        body: "'还差得远呢'、'web3用户快枯竭了'——这些清醒的判断让你与狂热的Degen区别开来。你能在市场噪音中保持独立思考，渴望用努力和时间填补认知差距，这种自省精神是穿越牛熊周期的关键。"
      }
    ],
    summary: "你是一位罕见的'在场'的思考者。既是深入一线的Builder，又是跳出系统反思的观察家。保持这份对技术的热忱和对社区的忠诚，你的未来不只是写代码，更是定义下一代协议的价值。"
  },

  soulFormula: {
    tagline: "你的品味，是代码与社区共识的混合体。",
    matches: [
      {
        name: "Hayden Adams",
        percentage: 45,
        role: "自学成才的DeFi筑梦师",
        explanation: "你的成长轨迹与他高度重合——从零基础自学，到渴望打造真正有价值的产品。你对代码'就是一坨'的自嘲，正是他当年面对Solidity时的心声。这种'Just build it'的信念是你的核心驱动力。"
      },
      {
        name: "Vitalik Buterin",
        percentage: 35,
        role: "极客理想主义布道者",
        explanation: "你对'炒冷饭'项目的厌倦和对行业'用户枯竭'的担忧，与V神对生态健康和公共利益的关注不谋而合。你不只满足于技术实现，更在乎它背后的价值与哲学，这是你区别于普通Degen的思考深度。"
      },
      {
        name: "Anatoly Yakovenko",
        percentage: 20,
        role: "性能至上的硬核工程师",
        explanation: "你对Aptos、Sui、Solana的广泛关注，暴露了你对高性能公链的浓厚兴趣。你渴望'拆解'和'优化'，这种深入系统底层的冲动，正是Anatoly解决区块链性能瓶颈的初心。"
      }
    ],
    finalIdentity: {
      title: "你的灵魂角色",
      identity: "脚踏实地的Web3理想构造家",
      identity_en: "The Pragmatic Web3 Ideal Architect"
    }
  }
};

export const mockUser: TwitterUser = {
  username: "v",
  display_name: "Vitalik Buterin",
  profile_image_url: "/images/youmindCardTest.JPG",
  description: "I'm a software engineer and the co-founder of Ethereum.",
};