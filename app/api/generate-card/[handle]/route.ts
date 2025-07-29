import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    
    // 创建一个简单的卡片图片
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    // 设置背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // 添加文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${handle} - Twitter Personality Analysis`, 600, 200);
    
    ctx.font = '24px Arial';
    ctx.fillText('AI-powered personality analysis', 600, 280);
    ctx.fillText('based on Twitter activity patterns', 600, 320);
    
    // 添加YouMind logo
    ctx.font = 'bold 36px Arial';
    ctx.fillText('@youmind_ai', 600, 500);
    
    // 转换为buffer
    const buffer = canvas.toBuffer('image/png');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('生成卡片失败:', error);
    return NextResponse.json(
      { error: 'Failed to generate card' },
      { status: 500 }
    );
  }
} 