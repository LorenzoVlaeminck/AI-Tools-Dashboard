export enum ToolCategory {
  TEXT = 'Text & Copywriting',
  IMAGE = 'Image Generation',
  VIDEO = 'Video Creation',
  AUDIO = 'Audio & Speech',
  SOCIAL = 'Social Media',
  PRODUCTIVITY = 'Productivity'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  affiliateLink: string;
  priceModel: 'Free' | 'Freemium' | 'Paid';
  rating: number; // 0 to 5
  monthlyVisits?: string;
  imageUrl: string;
  features: string[];
  offer?: string; // Special affiliate offer (e.g., "20% Off")
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
