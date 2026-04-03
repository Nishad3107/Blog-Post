import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'TravelBlog';
  const subtitle = searchParams.get('subtitle') || 'Explore the world';
  const image = searchParams.get('image');

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '64px',
          background: 'linear-gradient(135deg, #0b2a33, #0e452c)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: '60%' }}>
          <div style={{ fontSize: 22, letterSpacing: 6, opacity: 0.7 }}>TRAVELBLOG</div>
          <div style={{ fontSize: 64, fontWeight: 700, marginTop: 16 }}>{title}</div>
          <div style={{ fontSize: 28, marginTop: 16, opacity: 0.85 }}>{subtitle}</div>
        </div>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 24,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {image ? (
            <img src={image} width="360" height="360" style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: 120 }}>🌍</div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
