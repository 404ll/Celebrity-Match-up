import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import type { LaunchCardData, PersonalTasteDeepDiveData, TasteProfileData } from '../../../types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const picture = searchParams.get('picture') || '';
    const name = searchParams.get('name') || '匿名用户';
    const username = searchParams.get('username') || 'unknown';
    const section = (searchParams.get('section') || 'TasteProfile') as
      | 'TasteProfile'
      | 'PersonalTasteDeepDive'
      | 'LaunchCard';
    const contentRaw = searchParams.get('content') || '';

    // Try parsing JSON content
    let content: any = contentRaw;
    try {
      content = JSON.parse(contentRaw);
    } catch {
      // keep as string
    }

    return new ImageResponse(renderCardImage({ section, content, picture, name, username }), {
      width: 1200,
      height: 630,
    });
  } catch (e) {
    console.error('Failed to generate image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

function renderCardImage({
  section,
  content,
  picture,
  name,
  username,
}: {
  section: 'TasteProfile' | 'PersonalTasteDeepDive' | 'LaunchCard';
  content: any;
  picture: string;
  name: string;
  username: string;
}) {
  const bg = '#0b0b0c';
  const cardBg = '#101115';
  const text = '#e6e7ea';
  const subtext = '#b3b6be';
  const border = '#23252d';
  const accents: Record<string, string> = {
    TasteProfile: '#b96cf5',
    PersonalTasteDeepDive: '#7c8df9',
    LaunchCard: '#4fd1a1',
  };
  const accent = accents[section] ?? '#b96cf5';

  const header = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 26,
        alignItems: 'center',
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: accent,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: text }}>YouMind AI</span>
          <span style={{ fontSize: 20, color: subtext }}>{section}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={picture || '/placeholder.svg'}
            alt="avatar"
            width={64}
            height={64}
            style={{ borderRadius: 999, objectFit: 'cover', border: `2px solid ${border}` }}
          />
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: text }}>{name}</span>
          <span style={{ fontSize: 18, color: subtext }}>@{username}</span>
        </div>
      </div>
    </div>
  );

  const body =
    section === 'TasteProfile'
      ? renderTasteProfile(content as Partial<TasteProfileData>, accent, text, subtext)
      : section === 'PersonalTasteDeepDive'
        ? renderDeepDive(content as Partial<PersonalTasteDeepDiveData>, accent, text, subtext)
        : renderLaunchCard(content as Partial<LaunchCardData>, accent, text, subtext);

  const footer = (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        right: 36,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: subtext,
        fontSize: 18,
      }}
    >
      <span>youmind.ai</span>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        width: 1200,
        height: 630,
        background: bg,
        padding: 48,
        boxSizing: 'border-box',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI',
      }}
    >
      <div
        style={{
          background: cardBg,
          borderRadius: 24,
          border: `1px solid ${border}`,
          padding: 36,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {header}
        <div style={{ flex: 1, paddingTop: 24, overflow: 'hidden' }}>{body}</div>
        {footer}
      </div>
    </div>
  );
}

function renderTasteProfile(
  data: Partial<TasteProfileData>,
  accent: string,
  text: string,
  subtext: string,
) {
  const matches = (data.matches ?? []).slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {data.tagline ? (
        <div
          style={{
            fontSize: 26,
            color: text,
            background: `${accent}20`,
            border: `1px solid ${accent}40`,
            padding: '12px 16px',
            borderRadius: 12,
            fontStyle: 'italic',
          }}
        >
          {'“' + data.tagline + '”'}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {matches.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              background: '#151821',
              border: '1px solid #23252d',
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div
              style={{
                minWidth: 56,
                height: 56,
                borderRadius: 999,
                background: accent,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              {(m?.percentage ?? 0) + '%'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: text }}>
                  {m?.name ?? '正在分析中'}
                </span>
                {m?.coreTaste ? (
                  <span
                    style={{
                      fontSize: 16,
                      color: accent,
                      border: `1px solid ${accent}`,
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    {m.coreTaste}
                  </span>
                ) : null}
              </div>
              <span style={{ fontSize: 20, color: subtext }}>
                {truncate((m?.explanation ?? '正在分析中...') as string, 180)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {data.finalIdentity?.identity ? (
        <div
          style={{
            marginTop: 6,
            background: accent,
            color: 'white',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>
            {data.finalIdentity.title ?? ''}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            {truncate(data.finalIdentity.identity, 160)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function renderDeepDive(
  data: Partial<PersonalTasteDeepDiveData>,
  accent: string,
  text: string,
  subtext: string,
) {
  const points = (data.points ?? []).slice(0, 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {data.title ? (
        <div
          style={{
            fontSize: 26,
            color: text,
            background: `${accent}20`,
            border: `1px solid ${accent}40`,
            padding: '12px 16px',
            borderRadius: 12,
            fontStyle: 'italic',
          }}
        >
          {'“' + data.title + '”'}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 14 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: accent,
                color: 'white',
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              {i + 1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: text }}>
                {p?.title ?? '分析点'}
              </div>
              <div style={{ fontSize: 20, color: subtext }}>
                {truncate(p?.body ?? '正在分析中...', 200)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.summary ? (
        <div
          style={{
            marginTop: 4,
            background: accent,
            color: 'white',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Summary</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{truncate(data.summary, 180)}</div>
        </div>
      ) : null}
    </div>
  );
}

function renderLaunchCard(
  data: Partial<LaunchCardData>,
  accent: string,
  text: string,
  subtext: string,
) {
  const suggestions = (data.suggestions ?? []).slice(0, 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {data.title ? (
        <div
          style={{
            fontSize: 26,
            color: text,
            background: `${accent}20`,
            border: `1px solid ${accent}40`,
            padding: '12px 16px',
            borderRadius: 12,
            fontStyle: 'italic',
          }}
        >
          {'“' + data.title + '”'}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 14 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: accent,
                color: 'white',
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              {i + 1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{s?.title ?? '建议'}</div>
              <div style={{ fontSize: 20, color: subtext }}>
                {truncate(s?.body ?? '正在分析中...', 200)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.closingThought ? (
        <div
          style={{
            marginTop: 4,
            background: accent,
            color: 'white',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Closing Thought</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{truncate(data.closingThought, 180)}</div>
        </div>
      ) : null}
    </div>
  );
}

function truncate(str: string, max = 200) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}
