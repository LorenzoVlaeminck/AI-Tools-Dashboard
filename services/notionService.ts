import { Tool, ToolCategory } from '../types';
import { AI_TOOLS_DATA } from '../constants';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Use a CORS proxy to allow browser-based requests to Notion API
// In production, this should be replaced by a proper backend proxy.
const PROXY_URL = 'https://corsproxy.io/?'; 
const TARGET_URL = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
const NOTION_API_URL = `${PROXY_URL}${encodeURIComponent(TARGET_URL)}`;

export const fetchToolsFromNotion = async (): Promise<Tool[]> => {
  // 1. Check if keys exist. If not, fallback to mock data immediately.
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.warn("Notion credentials (NOTION_API_KEY or NOTION_DATABASE_ID) missing. Using local data.");
    return mockFetch();
  }

  try {
    const response = await fetch(NOTION_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      // Sorting by name is optional, but good for consistency
      body: JSON.stringify({
        sorts: [
          {
            property: 'Name',
            direction: 'ascending',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return mapNotionResponseToTools(data.results);

  } catch (error) {
    console.error("Failed to fetch from real Notion Database.", error);
    // Return mock data so the app doesn't break, but log the error clearly
    return mockFetch();
  }
};

// --- Helper: Mock Fetch (Previous Behavior) ---
const mockFetch = async (): Promise<Tool[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const timestamp = Date.now().toString();
  return AI_TOOLS_DATA.map(tool => {
    let newLink = tool.affiliateLink;
    try {
      const url = new URL(tool.affiliateLink);
      url.searchParams.set('last_synced', timestamp);
      newLink = url.toString();
    } catch (e) {
      const separator = newLink.includes('?') ? '&' : '?';
      newLink = `${newLink}${separator}last_synced=${timestamp}`;
    }
    return { ...tool, affiliateLink: newLink };
  });
};

// --- Helper: Notion Mapper ---

const mapNotionResponseToTools = (results: any[]): Tool[] => {
  return results.map((page: any) => {
    const props = page.properties;

    // Helper to extract text safely with optional chaining
    const getText = (prop: any) => prop?.rich_text?.[0]?.plain_text || '';
    const getTitle = (prop: any) => prop?.title?.[0]?.plain_text || 'Untitled Tool';
    const getSelect = (prop: any) => prop?.select?.name || '';
    const getNumber = (prop: any) => prop?.number || 0;
    const getUrl = (prop: any) => prop?.url || '';
    const getMultiSelect = (prop: any) => prop?.multi_select?.map((item: any) => item.name) || [];
    
    // Image handling: Notion returns 'file' (hosted by Notion, expires) or 'external' (url)
    const getImage = (prop: any) => {
      const fileObj = prop?.files?.[0];
      if (!fileObj) return 'https://picsum.photos/400/200?grayscale'; // Fallback
      return fileObj.type === 'file' ? fileObj.file.url : fileObj.external.url;
    };

    // Category Matching
    const rawCategory = getSelect(props['Category']);
    let category = ToolCategory.PRODUCTIVITY; // Default
    // Attempt to match string to Enum
    const matchedCategory = Object.values(ToolCategory).find(c => c === rawCategory);
    if (matchedCategory) category = matchedCategory;

    // Price Model Matching
    const rawPrice = getSelect(props['Price Model']);
    const priceModel = (['Free', 'Freemium', 'Paid'].includes(rawPrice) ? rawPrice : 'Freemium') as 'Free' | 'Freemium' | 'Paid';

    return {
      id: page.id,
      name: getTitle(props['Name']),
      description: getText(props['Description']),
      category: category,
      affiliateLink: getUrl(props['Affiliate Link']) || '#',
      priceModel: priceModel,
      rating: getNumber(props['Rating']),
      monthlyVisits: getText(props['Monthly Visits']) || 'N/A',
      imageUrl: getImage(props['Image']),
      features: getMultiSelect(props['Features']),
      offer: getText(props['Offer']) || undefined,
    };
  });
};