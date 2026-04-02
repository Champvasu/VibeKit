import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';
import { formatDate } from '../../utils/slug';
import styles from '../../styles/App.module.css';

export default function AppDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { fetchPages(); }, []);

  // Focus modal input when it opens
  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [showModal]);

  const fetchPages = async () => {
    try {
      const data = await api.get('/api/pages');
      setPages(data.pages || []);
    } catch (err) {
      toast('Could not load your pages. Check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createPage = async () => {
    const title = newTitle.trim();
    if (!title) return toast('Give your page a name first.', 'warning');
    setCreating(true);
    try {
      const data = await api.post('/api/pages', { title });
      toast('Page created.', 'success');
      setShowModal(false);
      setNewTitle('');
      router.push(`/editor/${data.page._id}`);
    } catch (err) {
      toast(err.message || 'Failed to create page.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const deletePage = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/page/${id}`);
      setPages(prev => prev.filter(p => p._id !== id));
      toast('Page deleted.', 'info');
    } catch (err) {
      toast(err.message || 'Could not delete page.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNewTitle('');
  };

  return (
    <>
      <Head><title>My Pages · VibeKit Studio</title></Head>
      <DashboardLayout title="My Pages">
        <div className={styles.topBar}>
          <p className={styles.count}>
            {loading
              ? 'Loading…'
              : pages.length === 0
                ? 'No pages yet'
                : `${pages.length} page${pages.length !== 1 ? 's' : ''}`}
          </p>
          <button className={styles.createBtn} onClick={() => setShowModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New page
          </button>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className={styles.grid}>
            {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && pages.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIllustration}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Nothing here yet</h3>
            <p className={styles.emptyText}>
              Create your first page and hit publish in under a minute.
            </p>
            <button className={styles.createBtn} onClick={() => setShowModal(true)}>
              Create a page
            </button>
          </div>
        )}

        {/* Page grid */}
        {!loading && pages.length > 0 && (
          <div className={styles.grid}>
            {pages.map(page => (
              <div key={page._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.themeTag}>{page.theme}</span>
                  <span className={`${styles.status} ${page.published ? styles.live : styles.draft}`}>
                    <span className={styles.statusDot} />
                    {page.published ? 'Live' : 'Draft'}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{page.title || 'Untitled'}</h3>
                <p className={styles.cardSlug}>/p/{page.slug}</p>

                <div className={styles.cardMeta}>
                  <span className={styles.views}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {page.views ?? 0}
                  </span>
                  <span className={styles.date}>{formatDate(page.createdAt)}</span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.actionEdit}
                    onClick={() => router.push(`/editor/${page._id}`)}
                  >
                    Edit
                  </button>
                  {page.published && (
                    <a
                      className={styles.actionView}
                      href={`/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View ↗
                    </a>
                  )}
                  <button
                    className={styles.actionDelete}
                    onClick={() => deletePage(page._id, page.title)}
                    disabled={deletingId === page._id}
                  >
                    {deletingId === page._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New page modal */}
        {showModal && (
          <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className={styles.modal}>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
              <h2 className={styles.modalTitle}>New page</h2>
              <p className={styles.modalSub}>What do you want to call it?</p>
              <input
                ref={inputRef}
                className={styles.modalInput}
                type="text"
                placeholder="e.g. Product launch, Portfolio, About me"
                value={newTitle}
                maxLength={80}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !creating && createPage()}
              />
              <div className={styles.modalActions}>
                <button className={styles.modalCancel} onClick={closeModal}>Cancel</button>
                <button className={styles.modalCreate} onClick={createPage} disabled={creating || !newTitle.trim()}>
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
