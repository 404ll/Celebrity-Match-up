import { Metadata } from "next";

export interface MetadataParams {
  handle: string;
  type?: string;
  baseUrl?: string;
}

/**
 * 生成 Twitter 分析页面的元数据
 * @param params 元数据参数
 * @returns Promise<Metadata>
 */
export async function generateTwitterAnalysisMetadata({
  handle,
  type = "main",
  baseUrl,
}: MetadataParams): Promise<Metadata> {
  // 获取当前域名
  const defaultBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const finalBaseUrl = baseUrl || defaultBaseUrl;
  console.log("finalBaseUrl", finalBaseUrl);

  // 动态生成图片 URL
  const imageUrl = `${finalBaseUrl}/api/generate-card/${handle}?type=${type}`;
  console.log("imageUrl", imageUrl);
  return {
    title: `${handle} - Twitter Personality Analysis`,
    description: `AI-powered personality analysis for @${handle} based on Twitter activity patterns`,
    openGraph: {
      title: `${handle} - Twitter Personality Analysis`,
      description: `AI-powered personality analysis for @${handle} based on Twitter activity patterns`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${handle} - Twitter Personality Analysis`,
      description: `AI-powered personality analysis for @${handle} based on Twitter activity patterns`,
      images: [imageUrl],
    },
  };
}

/**
 * 生成通用页面元数据
 * @param params 元数据参数
 * @returns Promise<Metadata>
 */
export async function generateGenericMetadata({
  title,
  description,
  imageUrl,
  baseUrl,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  baseUrl?: string;
}): Promise<Metadata> {
  const defaultBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const finalBaseUrl = baseUrl || defaultBaseUrl;
  const finalImageUrl = imageUrl || `${finalBaseUrl}/api/generate-card/default?type=main`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: finalImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImageUrl],
    },
  };
} 