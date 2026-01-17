import { Tool, ToolCategory } from './types';

// NOTE: In a real production app, this data would be fetched from your Notion Database API
// or a proxy server. For this dashboard, we simulate the database state here.
// Update the 'affiliateLink' fields with your actual unique affiliate URLs.

export const AI_TOOLS_DATA: Tool[] = [
  {
    id: '1',
    name: 'Jasper AI',
    description: 'Advanced AI content generator for marketing copy, blog posts, and social media.',
    category: ToolCategory.TEXT,
    affiliateLink: 'https://jasper.ai?fpr=your-id',
    priceModel: 'Paid',
    rating: 4.8,
    monthlyVisits: '5M+',
    imageUrl: 'https://picsum.photos/400/200?random=1',
    features: ['Brand Voice', 'SEO Integration', '50+ Templates']
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'Generates hyper-realistic images from text prompts via Discord.',
    category: ToolCategory.IMAGE,
    affiliateLink: 'https://midjourney.com',
    priceModel: 'Paid',
    rating: 4.9,
    monthlyVisits: '15M+',
    imageUrl: 'https://picsum.photos/400/200?random=2',
    features: ['High Resolution', 'Artistic Styles', 'Discord Community']
  },
  {
    id: '3',
    name: 'Copy.ai',
    description: 'AI-powered copywriter for businesses and freelance writers.',
    category: ToolCategory.TEXT,
    affiliateLink: 'https://copy.ai?ref=your-id',
    priceModel: 'Freemium',
    rating: 4.6,
    monthlyVisits: '3M+',
    imageUrl: 'https://picsum.photos/400/200?random=3',
    features: ['Unlimited Words (Pro)', '90+ Tools', 'Blog Wizard']
  },
  {
    id: '4',
    name: 'Runway Gen-2',
    description: 'A robust video editing and generation suite powered by AI.',
    category: ToolCategory.VIDEO,
    affiliateLink: 'https://runwayml.com?ref=your-id',
    priceModel: 'Freemium',
    rating: 4.7,
    monthlyVisits: '2M+',
    imageUrl: 'https://picsum.photos/400/200?random=4',
    features: ['Text to Video', 'Inpainting', 'Green Screen']
  },
  {
    id: '5',
    name: 'ElevenLabs',
    description: 'The most realistic AI text-to-speech and voice cloning software.',
    category: ToolCategory.AUDIO,
    affiliateLink: 'https://elevenlabs.io/?from=your-id',
    priceModel: 'Freemium',
    rating: 4.9,
    monthlyVisits: '8M+',
    imageUrl: 'https://picsum.photos/400/200?random=5',
    features: ['Voice Cloning', 'Multilingual', 'API Access']
  },
  {
    id: '6',
    name: 'Notion AI',
    description: 'Integrated AI assistant within your Notion workspace for notes and docs.',
    category: ToolCategory.PRODUCTIVITY,
    affiliateLink: 'https://notion.so?aff=your-id',
    priceModel: 'Paid',
    rating: 4.8,
    monthlyVisits: '150M+',
    imageUrl: 'https://picsum.photos/400/200?random=6',
    features: ['Summarization', 'Translation', 'Brainstorming']
  },
  {
    id: '7',
    name: 'Synthesia',
    description: 'Create professional AI videos from text in 120+ languages.',
    category: ToolCategory.VIDEO,
    affiliateLink: 'https://synthesia.io/?via=your-id',
    priceModel: 'Paid',
    rating: 4.5,
    monthlyVisits: '1M+',
    imageUrl: 'https://picsum.photos/400/200?random=7',
    features: ['AI Avatars', '120+ Languages', 'Screen Recorder']
  },
  {
    id: '8',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster.',
    category: ToolCategory.DEV,
    affiliateLink: 'https://github.com/features/copilot',
    priceModel: 'Paid',
    rating: 4.9,
    monthlyVisits: '400M+',
    imageUrl: 'https://picsum.photos/400/200?random=8',
    features: ['Code Completion', 'Chat', 'Debugging']
  },
  {
    id: '9',
    name: 'Descript',
    description: 'All-in-one video and audio editing, as easy as a doc.',
    category: ToolCategory.AUDIO,
    affiliateLink: 'https://descript.com?lmref=your-id',
    priceModel: 'Freemium',
    rating: 4.7,
    monthlyVisits: '2.5M+',
    imageUrl: 'https://picsum.photos/400/200?random=9',
    features: ['Overdub', 'Studio Sound', 'Transcription']
  },
  {
    id: '10',
    name: 'Canva Magic Studio',
    description: 'A suite of AI tools integrated into the Canva design platform.',
    category: ToolCategory.IMAGE,
    affiliateLink: 'https://canva.com?click=your-id',
    priceModel: 'Freemium',
    rating: 4.8,
    monthlyVisits: '100M+',
    imageUrl: 'https://picsum.photos/400/200?random=10',
    features: ['Magic Edit', 'Magic Write', 'Design Generation']
  }
];