/**
 * Generates a URL-safe slug from a title string,
 * appending a short random suffix to avoid collisions.
 */
export function generateSlug(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .slice(0, 48);                   // max 48 chars for readability

  const suffix = Math.random().toString(36).slice(2, 7); // e.g. "k3m9x"
  return `${base}-${suffix}`;
}

/**
 * Formats an ISO date string into a readable short date.
 * e.g. "Jan 5, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
