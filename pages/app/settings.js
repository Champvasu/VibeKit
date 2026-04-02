import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';
import { useAppTheme } from '../../context/ThemeContext';
import styles from '../../styles/Settings.module.css';

export default function Settings() {
  const { theme, toggle } = useAppTheme();

  return (
    <>
      <Head><title>Settings · VibeKit Studio</title></Head>
      <DashboardLayout title="Settings">
        <div className={styles.container}>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Appearance</h2>
            <p className={styles.cardSub}>Switch between light and dark mode based on your preference.</p>
            <div className={styles.themeRow}>
              <div>
                <div className={styles.themeLabel}>Theme</div>
                <div className={styles.themeValue}>{theme === 'dark' ? 'Dark' : 'Light'} mode</div>
              </div>
              <button className={styles.toggleBtn} onClick={toggle}>
                Switch to {theme === 'dark' ? 'light' : 'dark'}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Account</h2>
            <p className={styles.cardSub}>Basic information about your account.</p>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Current Plan</span>
              <span className={styles.badge}>Free plan</span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>About</h2>
            <p className={styles.cardSub}>
              VibeKit is a simple tool to create and share pages quickly. You can write content, preview it live, and publish it with a link.
            </p>
            <div className={styles.row}>
              <span className={styles.rowLabel}></span>
              <span className={styles.rowValue}></span>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </>
  );
}
