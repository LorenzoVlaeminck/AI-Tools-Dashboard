export enum ToolCategory {
  TEXT = 'Text & Copywriting',
  IMAGE = 'Image Generation',
  VIDEO = 'Video Creation',
  AUDIO = 'Audio & Speech',
  PRODUCTIVITY = 'Productivity',
  DEV = 'Development'
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
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
