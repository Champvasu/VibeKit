import dbConnect from '../../../lib/db';
import Page from '../../../models/Page';
import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
  const { id } = req.query;

  if (!id || id.length !== 24) {
    return res.status(400).json({ error: 'Invalid page ID.' });
  }

  try {
    await dbConnect();

    const page = await Page.findOne({ _id: id, userId: req.userId });
    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ page });
    }

    if (req.method === 'PUT') {
      const { title, slug, content, theme, published } = req.body;

      if (title    !== undefined) page.title   = title.trim() || page.title;
      if (slug     !== undefined) page.slug    = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') || page.slug;
      if (content  !== undefined) page.content = content;
      if (theme    !== undefined) page.theme   = theme;
      if (published !== undefined) page.published = Boolean(published);

      page.updatedAt = new Date();
      await page.save();
      return res.status(200).json({ page });
    }

    if (req.method === 'DELETE') {
      await page.deleteOne();
      return res.status(200).json({ message: 'Deleted.' });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('[api/page/[id]]', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

export default requireAuth(handler);
