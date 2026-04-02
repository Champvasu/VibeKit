import Head from 'next/head';
import { PAGE_THEMES } from '../../components/editor/PreviewPanel';
import styles from '../../styles/PublicPage.module.css';

/**
 * Public-facing page renderer.
 * Uses server-side props to fetch the page by slug and increment views.
 * Falls back to a 404 if the page isn't found or isn't published.
 */
export async function getServerSideProps({ params, req }) {
  // Build base URL from request headers so it works in any environment
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host  = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/public?slug=${encodeURIComponent(params.slug)}`);
    if (!res.ok) return { notFound: true };
    const data = await res.json();
    if (!data.page) return { notFound: true };
    // Serialize mongoose object
    return { props: { page: JSON.parse(JSON.stringify(data.page)) } };
  } catch (err) {
    console.error('[public page] fetch error:', err.message);
    return { notFound: true };
  }
}

export default function PublicPage({ page }) {
  const t = PAGE_THEMES[page.theme] || PAGE_THEMES.dark;
  const hero     = page.content?.hero     || {};
  const features = page.content?.features || { title: 'Features', items: [] };

  return (
    <>
      <Head>
        <title>{page.title || 'VibeKit Page'}</title>
        <meta name="description" content={hero.subtitle || ''} />
        {/* Prevent dashboard theme from bleeding in */}
        <style>{`html, body { background: none !important; }`}</style>
      </Head>

      <div className={styles.page} style={{ background: t.bg, color: t.text }}>

        {/* ── Nav ── */}
        <nav className={styles.nav} style={{ background: t.navBg, borderColor: t.cardBorder }}>
          <div className={styles.navInner}>
            <span className={styles.brand} style={{ color: t.text }}>{page.title}</span>
            {hero.ctaText && (
              <a
                href={hero.ctaLink || '#'}
                className={styles.navCta}
                style={{
                  background: t.btnBg,
                  color: t.btnText,
                  border: t.btnBorder || 'none',
                  boxShadow: t.btnShadow || 'none',
                }}
              >
                {hero.ctaText}
              </a>
            )}
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className={styles.hero} style={{ background: t.heroBg }}>
          <div className={styles.heroInner}>
            {hero.title && (
              <h1 className={styles.heroTitle} style={{ color: t.text }}>
                {hero.title}
              </h1>
            )}
            {hero.subtitle && (
              <p className={styles.heroSub} style={{ color: t.text2 }}>
                {hero.subtitle}
              </p>
            )}
            {hero.ctaText && (
              <a
                href={hero.ctaLink || '#'}
                className={styles.heroCta}
                style={{
                  background: t.btnBg,
                  color: t.btnText,
                  border: t.btnBorder || 'none',
                  boxShadow: t.btnShadow || 'none',
                }}
              >
                {hero.ctaText}
              </a>
            )}
          </div>
        </section>

        {/* ── Features ── */}
        {features.items.length > 0 && (
          <section className={styles.features} style={{ background: t.bg2 }}>
            <div className={styles.featuresInner}>
              {features.title && (
                <h2 className={styles.featuresTitle} style={{ color: t.text }}>
                  {features.title}
                </h2>
              )}
              <div className={styles.featureGrid}>
                {features.items.map(item => (
                  <div
                    key={item.id}
                    className={styles.card}
                    style={{ background: t.cardBg, borderColor: t.cardBorder }}
                  >
                    <span className={styles.cardIcon}>{item.icon}</span>
                    <h3 className={styles.cardTitle} style={{ color: t.text }}>{item.title}</h3>
                    <p className={styles.cardDesc} style={{ color: t.text2 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className={styles.footer} style={{ borderColor: t.cardBorder }}>
          <div className={styles.footerInner} style={{ color: t.text2 }}>
            <span>
              Built with{' '}
              <a href="/" style={{ color: t.accent, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                VibeKit Studio
              </a>
            </span>
            <span className={styles.viewCount}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {page.views ?? 0} {page.views === 1 ? 'view' : 'views'}
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
