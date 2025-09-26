import { BK_KEY } from './storageKey';

export interface Card {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
  type: 'link' | 'image';
  tags: string[];
  pinned: boolean;
  created_at: string;
}

export function makeCard(page: any, tags: string[]): Card {
  return {
    id: crypto.randomUUID(),
    url: page.url,
    title: page.title || 'Untitled',
    description: page.description || '',
    image: page.image || null,
    favicon: page.favicon || null,
    domain: new URL(page.url).hostname,
    type: 'link',
    tags,
    pinned: false,
    created_at: new Date().toISOString()
  };
}
