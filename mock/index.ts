// growth/mock/index.ts - 更新后的mock数据

import { AIAnalysisResult, TwitterUser } from "@/types";

export const mockAnalysis: AIAnalysisResult = {
  LaunchCard: {
    cardTitle: "出发指令",
    title: "从潜力Builder到赛博世界奠基人",
    suggestions: [
      {
        title: "先发一个'能跑就行'的土狗项目",
        body: "别总想着搞个惊天动地的'完整产品'，那玩意儿容易把自己卷死。学学Hayden Adams老哥，失业了都能鼓捣出Uniswap。你先从解决'自己今天好无聊'这个痛点开始，写个能一键发币的玩具，或者一个能自动转发KOL金句的bot。记住，Web3第一定律：先跑起来，再想着怎么 rug... 啊不是，怎么迭代。"
      },
      {
        title: "把'摸鱼'升级为'学术性发呆'",
        body: "刷小文章谁不会啊，但V神之所以是V神，因为他能把发呆变成思考。下次再摸鱼，别光看热闹，试着把一个协议当成乐高一样拆开：它解决了啥问题？为啥这么设计？有没有更骚的操作？把这些想通了，以后跟人PVP或者在群里吹水，你就是最有文化的那个仔。认知，才是最强的Alpha。"
      }
    ],
    closingThought: "你的下一行代码，要么改变世界，要么变成MEME。"
  },

  GrowthCard: {
    cardTitle: "成长画像",
    points: [
      {
        title: "Web3 学徒与建设者",
        body: "你正处在从理论到实践的关键跃迁期。从参加黑客松、学习数据分析，到渴望'完成一整套的产品逻辑'，你的轨迹清晰地指向一个目标：成为一名真正的Builder。你对浅尝辄止的学习方式感到不满，这种对深度的追求是你最宝贵的资产。"
      },
      {
        title: "社区积极参与者",
        body: "你不是一个孤独的学习者。通过转发行业动态、参与CUITBCA等高校社群活动，你已经将自己织入中文Web3社区的网络中。这不仅为你提供了信息源，更重要的是构建了归属感和潜在的协作网络，这是Web3世界的核心精神。"
      },
      {
        title: "自省的理想主义者",
        body: "你具备一种宝贵的抽离感。在埋头学习的同时，你也在抬头看路，思考着'Web3用户枯竭'、'应用炒冷饭'等宏观问题。这种自省让你免于成为纯粹的技术工具人，而是有望成为能定义问题、引领方向的思考者。"
      }
    ],
    summary: "你是一位脚踏实地的Web3学徒，渴望用代码构建有价值的产品；同时，你又是一个心怀远方的理想主义者，在社区的喧嚣中保持着对行业未来的冷静思考和对个人成长的深刻焦虑。这种'既要又要'的张力，正是你未来突破的动力源泉。"
  },

  SoulFormula: {
    cardTitle: "人格共鸣",
    tagline: "你对 Web3 的探索，不仅是技术的学习，更是一场关于信念与成长的自我修行。",
    matches: [
      {
        name: "Hayden Adams",
        percentage: 45,
        role: "实践精神的同路人",
        explanation: "他的自学成才之路与你当下的努力高度重合。他证明了，一个执着的开发者，凭借一个好点子和强大的执行力，完全可以从零开始，构建出行业的关键基础设施。"
      },
      {
        name: "Vitalik Buterin",
        percentage: 35,
        role: "理想主义的引路灯",
        explanation: "你对行业本质的思考，与V神用技术重构社会的极客理想主义一脉相承。他提醒你，代码的最终目的是服务于一个更公平、更开放的系统，而不仅仅是功能实现。"
      },
      {
        name: "Anatoly Yakovenko",
        percentage: 20,
        role: "工程能力的终极向往",
        explanation: "当你苦恼于'写的代码其实就是一坨'时，Anatoly代表了你渴望成为的样子——一个能从底层优化性能、构建复杂系统的工程大师。他是你技术成长道路上遥远但清晰的灯塔。"
      }
    ],
    finalIdentity: {
      title: "你的灵魂原型",
      identity: "自学成才的 Web3 架构师，心怀纯粹的去中心化理想",
      identity_en: "A Self-Taught Web3 Architect with a Pure, Decentralized Ideal at Heart"
    }
  }
};

export const mockUser: TwitterUser = {
  username: "v",
  display_name: "Vitalik Buterin",
  profile_image_url: "/images/youmindCardTest.JPG",
  description: "I'm a software engineer and the co-founder of Ethereum.",
};