import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { api, setToken, isAuthenticated } from '../utils/api';
import { useToast } from '../components/Toast';
import styles from '../styles/Auth.module.css';

export default function Auth() {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) { router.replace('/app'); return; }
    // Read ?mode= from query string
    if (router.query.mode === 'signup' || router.query.mode === 'login') {
      setMode(router.query.mode);
    }
  }, [router.query.mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    const { password } = form;

    if (!email || !password) return toast('Both fields are required.', 'warning');
    if (password.length < 6)  return toast('Password needs to be at least 6 characters.', 'warning');

    setLoading(true);
    try {
      const data = await api.post('/api/auth', { email, password, action: mode });
      setToken(data.token);
      toast(mode === 'signup' ? 'Account created — welcome!' : 'Good to see you again.', 'success');
      router.push('/app');
    } catch (err) {
      toast(err.message || 'Something went wrong. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <>
      <Head>
        <title>{isSignup ? 'Create account' : 'Sign in'} · VibeKit Studio</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.glow} />
        <div className={styles.grid} />

        <Link href="/" className={styles.backLink}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Home
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>⬡</span>
              <span>VibeKit Studio</span>
            </Link>
            <h1 className={styles.title}>
              {isSignup ? 'Create an account' : 'Sign in'}
            </h1>
            <p className={styles.subtitle}>
              {isSignup
                ? 'Takes about 10 seconds.'
                : 'Your pages are waiting for you.'}
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder={isSignup ? 'Choose a password (6+ chars)' : 'Your password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} /> {isSignup ? 'Creating…' : 'Signing in…'}</>
                : isSignup ? 'Create account' : 'Sign in'
              }
            </button>
          </form>

          <p className={styles.switchText}>
            {isSignup ? 'Already have one?' : 'New here?'}{' '}
            <button
              className={styles.switchLink}
              onClick={() => setMode(isSignup ? 'login' : 'signup')}
            >
              {isSignup ? 'Sign in instead' : 'Create a free account'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
