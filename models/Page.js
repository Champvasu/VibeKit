import mongoose from 'mongoose';

const FeatureSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  icon:        { type: String, default: '✨' },
  title:       { type: String, default: 'Feature' },
  description: { type: String, default: '' },
}, { _id: false });

const HeroSchema = new mongoose.Schema({
  title:    { type: String, default: 'Your headline here' },
  subtitle: { type: String, default: 'A short description of what you offer.' },
  ctaText:  { type: String, default: 'Get started' },
  ctaLink:  { type: String, default: '#' },
}, { _id: false });

const FeaturesSchema = new mongoose.Schema({
  title: { type: String, default: 'Features' },
  items: { type: [FeatureSchema], default: () => ([
    { id: '1', icon: '⚡', title: 'Fast', description: 'Built for speed.' },
    { id: '2', icon: '🎨', title: 'Beautiful', description: 'Looks great out of the box.' },
    { id: '3', icon: '🔒', title: 'Secure', description: 'Your data is safe.' },
  ]) },
}, { _id: false });

const PageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 80,
  },
  content: {
    hero:     { type: HeroSchema,     default: () => ({}) },
    features: { type: FeaturesSchema, default: () => ({}) },
  },
  theme: {
    type: String,
    enum: ['dark', 'light', 'gradient', 'minimal', 'neon', 'aurora'],
    default: 'dark',
  },
  published: { type: Boolean, default: false },
  views:     { type: Number,  default: 0, min: 0 },
  createdAt: { type: Date,    default: Date.now },
  updatedAt: { type: Date,    default: Date.now },
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
