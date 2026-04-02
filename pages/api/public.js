import dbConnect from '../../lib/db';
import Page from '../../models/Page';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required.' });
  }

  try {
    await dbConnect();

    // Atomically increment views and return the updated doc
    const page = await Page.findOneAndUpdate(
      { slug: slug.toLowerCase(), published: true },
      { $inc: { views: 1 } },
      { new: true, lean: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found or not published.' });
    }

    return res.status(200).json({ page });
  } catch (err) {
    console.error('[api/public]', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
