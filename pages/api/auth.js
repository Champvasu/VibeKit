import dbConnect from '../../lib/db';
import User from '../../models/User';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { action, email, password } = req.body;

  // Basic validation
  if (!action || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!['signup', 'login'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action.' });
  }

  try {
    await dbConnect();

    if (action === 'signup') {
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      const user = await User.create({ email: email.toLowerCase().trim(), password });
      const token = signToken({ userId: user._id.toString() });
      return res.status(201).json({ token, user: { id: user._id, email: user.email } });
    }

    if (action === 'login') {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ error: 'No account found with that email.' });
      }
      const valid = await user.comparePassword(password);
      if (!valid) {
        return res.status(401).json({ error: 'Wrong password.' });
      }
      const token = signToken({ userId: user._id.toString() });
      return res.status(200).json({ token, user: { id: user._id, email: user.email } });
    }
  } catch (err) {
    console.error('[api/auth]', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
