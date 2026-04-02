import dbConnect from '../../lib/db';
import Page from '../../models/Page';
import { requireAuth } from '../../lib/auth';
import { generateSlug } from '../../utils/slug';

async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const pages = await Page.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json({ pages });
    }

    if (req.method === 'POST') {
      const { title } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required.' });
      }

      let slug = generateSlug(title);

      // Ensure slug is unique — retry up to 3 times
      for (let i = 0; i < 3; i++) {
        const existing = await Page.findOne({ slug });
        if (!existing) break;
        slug = generateSlug(title); // regenerate with new random suffix
      }

      const page = await Page.create({ userId: req.userId, title: title.trim(), slug });
      return res.status(201).json({ page });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('[api/pages]', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

export default requireAuth(handler);
