import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { api, isAuthenticated } from '../../utils/api';
import { useToast } from '../../components/Toast';
import LeftPanel from '../../components/editor/LeftPanel';
import PreviewPanel from '../../components/editor/PreviewPanel';
import styles from '../../styles/Editor.module.css';

const AUTO_SAVE_DELAY = 3000; // 3 seconds after last change

export default function EditorPage() {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [device, setDevice] = useState('desktop');
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'unsaved' | 'saving'

  // Ref for auto-save timer
  const autoSaveTimer = useRef(null);
  // Keep page in a ref too so the auto-save callback always has fresh data
  const pageRef = useRef(page);
  useEffect(() => { pageRef.current = page; }, [page]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/auth?mode=login'); return; }
    if (id) fetchPage();
    // Cleanup timer on unmount
    return () => clearTimeout(autoSaveTimer.current);
  }, [id]);

  const fetchPage = async () => {
    try {
      const data = await api.get(`/api/page/${id}`);
      setPage(data.page);
      setSaveState('saved');
    } catch (err) {
      toast('Could not load this page.', 'error');
      router.push('/app');
    } finally {
      setLoading(false);
    }
  };

  // Called every time user changes anything
  const handleChange = useCallback((updated) => {
    setPage(updated);
    setSaveState('unsaved');

    // Reset auto-save timer
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      const current = pageRef.current;
      if (!current) return;
      setSaveState('saving');
      try {
        await api.put(`/api/page/${id}`, {
          title: current.title,
          slug: current.slug,
          content: current.content,
          theme: current.theme,
        });
        setSaveState('saved');
      } catch {
        setSaveState('unsaved'); // let user retry manually
      }
    }, AUTO_SAVE_DELAY);
  }, [id]);

  // Manual save
  const handleSave = async () => {
    if (!page || saving) return;
    clearTimeout(autoSaveTimer.current);
    setSaving(true);
    setSaveState('saving');
    try {
      await api.put(`/api/page/${id}`, {
        title: page.title,
        slug: page.slug,
        content: page.content,
        theme: page.theme,
      });
      setSaveState('saved');
      toast('Saved.', 'success');
    } catch (err) {
      setSaveState('unsaved');
      toast(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Publish / unpublish — saves first, then toggles
  const handlePublishToggle = async () => {
    if (publishing) return;
    setPublishing(true);
    clearTimeout(autoSaveTimer.current);
    try {
      const updated = await api.put(`/api/page/${id}`, {
        title: page.title,
        slug: page.slug,
        content: page.content,
        theme: page.theme,
        published: !page.published,
      });
      setPage(updated.page);
      setSaveState('saved');
      toast(
        updated.page.published ? 'Your page is live.' : 'Page taken offline.',
        updated.page.published ? 'success' : 'info'
      );
    } catch (err) {
      toast(err.message || 'Could not update publish status.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${base}/p/${page.slug}`;
    navigator.clipboard.writeText(url)
      .then(() => toast('Link copied.', 'success'))
      .catch(() => toast('Could not copy. Try manually: ' + url, 'warning'));
  };

  // Save label
  const saveLabel = saveState === 'saving' ? 'Saving…' : saveState === 'unsaved' ? 'Save' : 'Saved';
  const isSaveBtnDisabled = saving || saveState === 'saving' || saveState === 'saved';

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <span>Opening editor…</span>
      </div>
    );
  }

  if (!page) return null;

  return (
    <>
      <Head><title>{page.title || 'Untitled'} — Editor · VibeKit Studio</title></Head>
      <div className={styles.editorLayout}>

        {/* ── Top bar ── */}
        <header className={styles.topBar}>
          <div className={styles.topLeft}>
            <button
              className={styles.backBtn}
              onClick={() => router.push('/app')}
              title="Back to dashboard"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div className={styles.pageInfo}>
              <span className={styles.pageTitle}>{page.title || 'Untitled'}</span>
              {/* Save state indicator */}
              <span
                className={`${styles.saveIndicator} ${styles[saveState]}`}
                title={saveState === 'unsaved' ? 'Unsaved changes' : saveState === 'saving' ? 'Saving…' : 'All changes saved'}
              >
                {saveState === 'saving' ? '◌ Saving…' : saveState === 'unsaved' ? '● Unsaved' : '✓ Saved'}
              </span>
            </div>
          </div>

          {/* Device toggle */}
          <div className={styles.deviceGroup}>
            {[
              { key: 'desktop', label: 'Desktop', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
              { key: 'tablet',  label: 'Tablet',  icon: <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg> },
              { key: 'mobile',  label: 'Mobile',  icon: <svg width="9" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg> },
            ].map(d => (
              <button
                key={d.key}
                className={`${styles.deviceBtn} ${device === d.key ? styles.deviceActive : ''}`}
                onClick={() => setDevice(d.key)}
                title={d.label}
              >
                {d.icon}
              </button>
            ))}
          </div>

          <div className={styles.topRight}>
            {page.published && (
              <button className={styles.copyBtn} onClick={copyLink}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                Copy link
              </button>
            )}

            <button
              className={`${styles.publishBtn} ${page.published ? styles.liveBtn : ''}`}
              onClick={handlePublishToggle}
              disabled={publishing}
            >
              {publishing ? '…' : page.published ? 'Take offline' : 'Publish'}
            </button>

            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={isSaveBtnDisabled}
            >
              {saving || saveState === 'saving' ? 'Saving…' : 'Save'}
            </button>
          </div>
        </header>

        {/* ── Editor body ── */}
        <div className={styles.editorBody}>
          <LeftPanel page={page} onChange={handleChange} />
          <PreviewPanel page={page} device={device} />
        </div>
      </div>
    </>
  );
}
