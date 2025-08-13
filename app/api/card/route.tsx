// app/api/card/route.tsx

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// 告诉 Next.js 这应该在 Edge Runtime 上运行，速度更快
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // --- 步骤 1: 从 URL 中获取参数 ---
    const name = searchParams.get('name') || 'Anonymous';
    const username = searchParams.get('username') || 'anonymous';
    const picture = searchParams.get('picture') || '';
    const content = searchParams.get('content') || '';

    // --- 步骤 2: 使用 JSX 设计图片布局 ---
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              width: '90%',
              height: '90%',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* 标题 */}
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                lineHeight: 1.2,
                marginBottom: '30px',
                textAlign: 'center',
              }}
            >
             {name}
            </h1>

            {/* 内容预览 */}
            {content && (
              <div
                style={{
                  fontSize: '18px',
                  color: '#374151',
                  lineHeight: 1.6,
                  marginBottom: '30px',
                  maxHeight: '200px',
                  overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                {content}
              </div>
            )}

            {/* 作者信息区域 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 'auto',
                justifyContent: 'center',
              }}
            >
              {picture && (
                <img
                  src={picture}
                  alt=""
                  width="60"
                  height="60"
                  style={{ 
                    borderRadius: '50%', 
                    marginRight: '20px',
                    border: '3px solid #667eea'
                  }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {name}
                </p>
                <p style={{ fontSize: '20px', color: '#6b7280', margin: 0 }}>
                  @{username}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      // --- 步骤 3: 配置图片选项 ---
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error(`Failed to generate the image: ${e.message}`);
    return new Response('Failed to generate the image', { status: 500 });
  }
}