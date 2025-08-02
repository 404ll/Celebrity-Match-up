// 生成唯一的卡片ID
export function generateCardId(data: {
  name: string;
  analysis: string;
}): string {
  const timestamp = Date.now();
  const nameSlug = data.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `${nameSlug}-${timestamp}`;
}

// 从卡片数据生成分享URL - 使用twitter路径格式
export function generateShareUrl(cardId: string, baseUrl?: string): string {
  // 优先使用环境变量，然后是Vercel URL，最后是localhost
  const base =
    baseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" && window.location.hostname !== "localhost"
      ? `https://${window.location.hostname}`
      : "https://taset.vercel.app/");

  // 如果cardId包含用户名，直接使用
  if (cardId && !cardId.includes("-")) {
    return `${base}/twitter/${cardId}`;
  }
  // 否则从cardId中提取用户名部分
  const username = cardId.split("-")[0];
  return `${base}/twitter/${username}`;
}

// 生成Twitter分享链接
export function generateTwitterShareUrl(
  data: { name: string; analysis: string; id?: string },
  url: string
): string {
  // 创建个性化的分享文本
  const shareText = `Check out this AI-powered personality analysis for @${data.name} by @youmind_ai #personalityanalysis #AI

${url}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
}
