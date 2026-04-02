import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
  return (
    <>
      <Head><title>404 — Page not found · VibeKit Studio</title></Head>
      <div className={styles.page}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Nothing here</h1>
        <p className={styles.sub}>
          This page might have been unpublished, or the link is wrong.
        </p>
        <Link href="/" className={styles.home}>Take me home</Link>
      </div>
    </>
  );
}
