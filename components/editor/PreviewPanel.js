import styles from './PreviewPanel.module.css';

// Theme definitions — drives both the editor preview and the public page
export const PAGE_THEMES = {
  dark: {
    bg: '#0d0d14', bg2: '#13131e',
    text: '#eeeef5', text2: '#9494b0',
    accent: '#6d5dfc',
    btnBg: 'linear-gradient(135deg,#6d5dfc,#a855f7)', btnText: '#fff',
    cardBg: 'rgba(255,255,255,0.04)', cardBorder: 'rgba(255,255,255,0.07)',
    heroBg: 'radial-gradient(ellipse at top,rgba(109,93,252,0.13) 0%,transparent 62%)',
    navBg: 'rgba(13,13,20,0.88)',
  },
  light: {
    bg: '#f5f5fb', bg2: '#ffffff',
    text: '#111118', text2: '#5a5a78',
    accent: '#5b4df0',
    btnBg: 'linear-gradient(135deg,#5b4df0,#9333ea)', btnText: '#fff',
    cardBg: '#ffffff', cardBorder: '#e4e4ef',
    heroBg: 'radial-gradient(ellipse at top,rgba(91,77,240,0.06) 0%,transparent 62%)',
    navBg: 'rgba(245,245,251,0.92)',
  },
  gradient: {
    bg: 'linear-gradient(150deg,#0f0c29 0%,#302b63 55%,#24243e 100%)',
    bg2: 'rgba(255,255,255,0.05)',
    text: '#fff', text2: 'rgba(255,255,255,0.6)',
    accent: '#f7c59f',
    btnBg: 'linear-gradient(135deg,#f7c59f,#e8533c)', btnText: '#fff',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,255,255,0.11)',
    heroBg: 'transparent',
    navBg: 'rgba(15,12,41,0.88)',
  },
  minimal: {
    bg: '#fafafa', bg2: '#fff',
    text: '#111', text2: '#666',
    accent: '#111',
    btnBg: '#111', btnText: '#fff',
    cardBg: '#fff', cardBorder: '#e8e8e8',
    heroBg: 'none',
    navBg: 'rgba(250,250,250,0.96)',
  },
  neon: {
    bg: '#050510', bg2: '#09091c',
    text: '#dde0ff', text2: '#7878bb',
    accent: '#00ffcc',
    btnBg: 'transparent', btnText: '#00ffcc',
    btnBorder: '1px solid #00ffcc',
    btnShadow: '0 0 18px rgba(0,255,204,0.28)',
    cardBg: 'rgba(0,255,204,0.03)', cardBorder: 'rgba(0,255,204,0.14)',
    heroBg: 'radial-gradient(ellipse at center,rgba(0,255,204,0.07) 0%,transparent 68%)',
    navBg: 'rgba(5,5,16,0.92)',
  },
  aurora: {
    bg: '#0a0f1e', bg2: '#0d1428',
    text: '#e4f0ff', text2: '#7296bb',
    accent: '#5ee7d8',
    btnBg: 'linear-gradient(135deg,#5ee7d8,#6e72fc)', btnText: '#fff',
    cardBg: 'rgba(94,231,216,0.04)', cardBorder: 'rgba(94,231,216,0.13)',
    heroBg: 'radial-gradient(ellipse at top left,rgba(94,231,216,0.09) 0%,rgba(110,114,252,0.07) 45%,transparent 70%)',
    navBg: 'rgba(10,15,30,0.9)',
  },
};

function deviceStyle(device) {
  if (device === 'tablet') return { width: '768px', minWidth: '768px' };
  if (device === 'mobile') return { width: '390px', minWidth: '390px' };
  return { width: '100%' };
}

export default function PreviewPanel({ page, device }) {
  const t = PAGE_THEMES[page.theme] || PAGE_THEMES.dark;
  // Null-safe destructuring
  const hero     = page.content?.hero     || {};
  const features = page.content?.features || { title: 'Features', items: [] };

  const cols = device === 'mobile'
    ? 1
    : Math.min(features.items.length || 1, 3);

  return (
    <div className={styles.wrapper}>
      {/* Device chrome label */}
      {device !== 'desktop' && (
        <div className={styles.deviceLabel}>
          {device === 'tablet' ? '768px · Tablet' : '390px · Mobile'}
        </div>
      )}

      <div className={styles.frame} style={deviceStyle(device)}>
        <div
          className={styles.pageRoot}
          style={{ background: t.bg, color: t.text, fontFamily: 'system-ui,sans-serif' }}
        >
          {/* Nav */}
          <nav style={{
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${t.cardBorder}`,
            background: t.bg2,
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: t.text }}>
              {page.title || 'Untitled'}
            </span>
            <span style={{
              padding: '6px 16px',
              borderRadius: 7,
              background: t.btnBg,
              color: t.btnText,
              fontSize: '0.775rem',
              fontWeight: 600,
              border: t.btnBorder || 'none',
              boxShadow: t.btnShadow || 'none',
            }}>
              {hero.ctaText || 'Get started'}
            </span>
          </nav>

          {/* Hero */}
          <div style={{
            padding: device === 'mobile' ? '44px 22px' : '68px 40px',
            textAlign: 'center',
            background: t.heroBg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}>
            <h1 style={{
              fontSize: device === 'mobile' ? '1.6rem' : '2.4rem',
              fontWeight: 800,
              color: t.text,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              maxWidth: 560,
              margin: 0,
            }}>
              {hero.title || 'Your headline goes here'}
            </h1>
            <p style={{
              fontSize: '0.9375rem',
              color: t.text2,
              maxWidth: 460,
              lineHeight: 1.65,
              margin: 0,
            }}>
              {hero.subtitle || 'Add a subheadline in the Hero tab.'}
            </p>
            <a style={{
              marginTop: 6,
              display: 'inline-block',
              padding: '11px 28px',
              borderRadius: 9,
              background: t.btnBg,
              color: t.btnText,
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
              border: t.btnBorder || 'none',
              boxShadow: t.btnShadow || 'none',
            }}>
              {hero.ctaText || 'Get started'}
            </a>
          </div>

          {/* Features */}
          {features.items.length > 0 && (
            <div style={{ padding: device === 'mobile' ? '36px 22px' : '56px 40px', background: t.bg2 }}>
              <h2 style={{
                textAlign: 'center',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: t.text,
                marginBottom: 28,
              }}>
                {features.title || 'Features'}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: 14,
                maxWidth: 900,
                margin: '0 auto',
              }}>
                {features.items.map(item => (
                  <div key={item.id} style={{
                    padding: 20,
                    borderRadius: 11,
                    background: t.cardBg,
                    border: `1px solid ${t.cardBorder}`,
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: t.text, marginBottom: 6 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: t.text2, lineHeight: 1.6 }}>
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: '20px 40px',
            borderTop: `1px solid ${t.cardBorder}`,
            textAlign: 'center',
            fontSize: '0.75rem',
            color: t.text2,
          }}>
            Made with VibeKit Studio
          </div>
        </div>
      </div>
    </div>
  );
}
