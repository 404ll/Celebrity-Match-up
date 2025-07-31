import { NextResponse } from 'next/server';

export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const svg = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#grad)" rx="100"/>
        <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="white">
          ${id.charAt(0).toUpperCase()}
        </text>
      </svg>
    `;
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 },
    );
  }
} 