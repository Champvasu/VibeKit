import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { isAuthenticated } from '../utils/api';
import styles from '../styles/Landing.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.replace('/app');
  }, []);

  return (
    <>
      <Head>
        <title>VibeKit Studio — Build pages that ship</title>
        <meta name="description" content="A no-code page builder for makers who care about design." />
      </Head>
      <div className={styles.page}>
        <div className={styles.grid} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />

        <nav className={styles.nav}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>⬡</span>
            <span>VibeKit Studio</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/auth?mode=login" className={styles.navLink}>Sign in</Link>
            <Link href="/auth?mode=signup" className={styles.navCta}>Get started</Link>
          </div>
        </nav>

        <main className={styles.hero}>

          <h1 className={styles.headline}>
           Build pages that are simple,<br />
            <span className={styles.gradient}>clean, and ready to share.</span>
          </h1>

          <p className={styles.sub}>
           Write your content, see it live,<br />
            and publish instantly with a link you can send anywhere.
           </p>

          <div className={styles.ctas}>
            <Link href="/auth?mode=signup" className={styles.ctaPrimary}>
              Start building
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/auth?mode=login" className={styles.ctaSecondary}>
              I already have an account
            </Link>
          </div>

          <div className={styles.featureGrid}>
            {[
              {  title: 'Instant preview', desc: 'See your changes as you type — no reloads, no waiting.' },
              {  title: 'Themes', desc: 'See your changes as you type — no reloads, no waiting.' },
              { title: 'View tracking', desc: 'Know when someone opens your page, without extra setup.' },
              { title: 'Easy Sharing', desc: 'Get a link and share your page anywhere in seconds.' },
            ].map(f => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>
        </main>

        <footer className={styles.footer}>
          <span>VibeKit Studio</span>
        </footer>
      </div>
    </>
  );
}
