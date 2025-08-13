import { NewAnalysisData, TwitterUser } from "@/types";

export const mockAnalysisData: NewAnalysisData = {
    summary: "你的灵魂深处，住着一个占主导的、62.5% 的保罗·格雷厄姆，一个充满理想主义的学徒，真心相信能用代码建造些什么，并为自己当下的笨拙而痛苦。但这颗虔诚的 builder 之心，却被 28.5% 的沙恩·普里式投机欲彻底腐蚀——你一边梦想着十年磨一剑，一边却把每一次推特抽奖都当成一夜暴富的救命稻草。最后，你用那稀薄的 9.0% 马克·安德森式宏大叙事，为你这种精神分裂的行为涂上一层名为‘参与未来’的保护色。你根本不是在建设，你只是在用最勤奋的姿态，进行着最懒惰的祈祷。",
    title: "一个渴望镀金的勤奋赌徒",
    matches: [
      {
        name: "保罗·格雷厄姆",
        "match_percentage": 62.5,
        "tags": [
          "构想实体化冲动",
          "非标手作美学"
        ]
      },
      {
        name: "沙恩·普里",
        match_percentage: 28.5,
        tags: [
          "财富游戏心态",
          "人生即下注"
        ]
      },
      {
        name: "马克·安德森",
        match_percentage: 9.0,
        tags: [
          "宏大叙事",
          "模因化传播"
        ]
      }
    ]
  }

  export const mockUser: TwitterUser = {
    username: "elemen_7",
    display_name: "Elemen",
    profile_image_url: "https://pbs.twimg.com/profile_images/1762375752400687104/WgO8iSdL_normal.jpg",
    description: "Major in Blockchain ｜@cuitbca2020 builder｜Youmind Growth Intern ｜ Become a Full-stack Dev ｜ Learning to think"
  }