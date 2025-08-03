import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'soul';
    
    console.log('Generating card for:', handle, 'type:', type);
    
    // 尝试导入 canvas
    let createCanvas;
    try {
      const canvasModule = await import('canvas');
      createCanvas = canvasModule.createCanvas;
      console.log('Canvas module loaded successfully');
    } catch (error) {
      console.error('Failed to load canvas module:', error);
      // 如果 canvas 不可用，返回一个简单的 SVG
      const svg = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="630" fill="#ff0000"/>
          <text x="600" y="150" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
            🎯 NEW TEST CARD
          </text>
          <text x="600" y="220" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="white">
            Handle: ${handle}
          </text>
          <text x="600" y="270" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="white">
            Type: ${type}
          </text>
          <text x="600" y="320" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white">
            Environment: ${process.env.NODE_ENV || 'development'}
          </text>
          <text x="600" y="370" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white">
            Timestamp: ${new Date().toISOString()}
          </text>
          <text x="600" y="420" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white">
            This is the NEW version with RED background
          </text>
        </svg>
      `;
      
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': 'Thu, 01 Jan 1970 00:00:00 GMT',
        },
      });
    }
    
    // 创建一个简单的卡片图片
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    console.log('Canvas created successfully');
    
    // 强制设置纯色背景 - 红色，这样很容易看出是否生效
    ctx.fillStyle = '#ff0000'; // 纯红色背景
    ctx.fillRect(0, 0, 1200, 630);
    
    // 添加白色文字
    ctx.fillStyle = '#ffffff'; // 白色文字
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 NEW TEST CARD', 600, 150);
    
    // 添加更多信息
    ctx.font = '36px Arial';
    ctx.fillText(`Handle: ${handle}`, 600, 220);
    ctx.fillText(`Type: ${type}`, 600, 270);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Environment: ${process.env.NODE_ENV || 'development'}`, 600, 320);
    ctx.fillText(`Timestamp: ${new Date().toISOString()}`, 600, 370);
    ctx.fillText('This is the NEW version with RED background', 600, 420);
    
    console.log('Canvas drawing completed');
    
    // 转换为buffer
    const buffer = canvas.toBuffer('image/png');
    
    console.log('Buffer created, size:', buffer.length);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': 'Thu, 01 Jan 1970 00:00:00 GMT',
      },
    });
  } catch (error) {
    console.error('生成卡片失败:', error);
    return NextResponse.json(
      { error: 'Failed to generate card', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 