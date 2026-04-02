import { useState } from 'react';
import styles from './LeftPanel.module.css';

const THEMES = [
  { value: 'dark',     label: 'Dark',     emoji: '🌑' },
  { value: 'light',    label: 'Light',    emoji: '☀️' },
  { value: 'gradient', label: 'Gradient', emoji: '🌈' },
  { value: 'minimal',  label: 'Minimal',  emoji: '◻' },
  { value: 'neon',     label: 'Neon',     emoji: '⚡' },
  { value: 'aurora',   label: 'Aurora',   emoji: '🌌' },
];

const ICONS = ['⚡','🎨','🔒','🚀','💡','🌍','🛠','📊','🎯','✨','🔥','💎','🧩','📦','🌟'];

export default function LeftPanel({ page, onChange }) {
  const [tab, setTab] = useState('settings');

  // ── helpers ──────────────────────────────────────────
  const update = (patch) => onChange({ ...page, ...patch });

  const updateHero = (key, val) =>
    update({ content: { ...page.content, hero: { ...page.content.hero, [key]: val } } });

  const updateFeatureField = (key, val) =>
    update({ content: { ...page.content, features: { ...page.content.features, [key]: val } } });

  const updateFeatureItem = (idx, key, val) => {
    const items = page.content.features.items.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    updateFeatureField('items', items);
  };

  const addFeature = () => {
    const items = [
      ...page.content.features.items,
      { id: Date.now().toString(), icon: '✨', title: 'New feature', description: 'What does this do?' },
    ];
    updateFeatureField('items', items);
  };

  const removeFeature = (idx) => {
    const items = page.content.features.items.filter((_, i) => i !== idx);
    updateFeatureField('items', items);
  };

  // ── guard against missing content ────────────────────
  const hero     = page.content?.hero     || {};
  const features = page.content?.features || { title: 'Features', items: [] };

  return (
    <aside className={styles.panel}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {[
          { key: 'settings', label: 'Settings' },
          { key: 'hero',     label: 'Hero' },
          { key: 'features', label: 'Features' },
        ].map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>

        {/* ── Settings tab ── */}
        {tab === 'settings' && (
          <div className={styles.section}>
            <Field label="Page title">
              <input
                className={styles.input}
                value={page.title || ''}
                onChange={e => update({ title: e.target.value })}
                placeholder="My page"
              />
            </Field>

            <Field label="URL slug" hint="letters, numbers and hyphens only">
              <div className={styles.slugRow}>
                <span className={styles.slugPrefix}>/p/</span>
                <input
                  className={styles.input}
                  value={page.slug || ''}
                  onChange={e => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
                  placeholder="my-page"
                />
              </div>
            </Field>

            <Field label="Theme">
              <div className={styles.themeGrid}>
                {THEMES.map(t => (
                  <button
                    key={t.value}
                    className={`${styles.themeBtn} ${page.theme === t.value ? styles.themeBtnActive : ''}`}
                    onClick={() => update({ theme: t.value })}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── Hero tab ── */}
        {tab === 'hero' && (
          <div className={styles.section}>
            <Field label="Headline">
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={hero.title || ''}
                onChange={e => updateHero('title', e.target.value)}
                placeholder="The one line that makes people stay"
                rows={2}
              />
            </Field>

            <Field label="Subheadline">
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={hero.subtitle || ''}
                onChange={e => updateHero('subtitle', e.target.value)}
                placeholder="A little more detail — who it's for, what they get"
                rows={3}
              />
            </Field>

            <Field label="Button label">
              <input
                className={styles.input}
                value={hero.ctaText || ''}
                onChange={e => updateHero('ctaText', e.target.value)}
                placeholder="Get started"
              />
            </Field>

            <Field label="Button link">
              <input
                className={styles.input}
                value={hero.ctaLink || ''}
                onChange={e => updateHero('ctaLink', e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </Field>
          </div>
        )}

        {/* ── Features tab ── */}
        {tab === 'features' && (
          <div className={styles.section}>
            <Field label="Section heading">
              <input
                className={styles.input}
                value={features.title || ''}
                onChange={e => updateFeatureField('title', e.target.value)}
                placeholder="Features"
              />
            </Field>

            {features.items.map((item, idx) => (
              <div key={item.id} className={styles.featureCard}>
                <div className={styles.featureCardHeader}>
                  <span className={styles.featureNum}>#{idx + 1}</span>
                  <button className={styles.removeBtn} onClick={() => removeFeature(idx)} title="Remove">✕</button>
                </div>

                <div className={styles.iconPicker}>
                  <span className={styles.subLabel}>Icon</span>
                  <div className={styles.iconGrid}>
                    {ICONS.map(icon => (
                      <button
                        key={icon}
                        className={`${styles.iconBtn} ${item.icon === icon ? styles.iconActive : ''}`}
                        onClick={() => updateFeatureItem(idx, 'icon', icon)}
                      >{icon}</button>
                    ))}
                  </div>
                </div>

                <Field label="Title">
                  <input
                    className={styles.input}
                    value={item.title || ''}
                    onChange={e => updateFeatureItem(idx, 'title', e.target.value)}
                    placeholder="Feature name"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={item.description || ''}
                    onChange={e => updateFeatureItem(idx, 'description', e.target.value)}
                    placeholder="Keep it short"
                    rows={2}
                  />
                </Field>
              </div>
            ))}

            <button className={styles.addBtn} onClick={addFeature}>
              + Add card
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// Small helper to reduce repetition
function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>
        {hint && <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
