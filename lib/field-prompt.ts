export const USER_FIELD_PROMPT = `根据用户的个人简介和推文，在crypto,finance,politics,venture,tech中选择2～3个领域作为用户主要的领域标签。

请返回以下JSON格式：
{
  "domains": [
    "crypto",
    "tech", 
    "finance"
  ]
}

注意：
- 只能选择2-3个领域
- 领域名称必须完全匹配：crypto, finance, politics, venture, tech
- 返回格式必须是有效的JSON
`;
