export interface CardItem {
  id: string;
  user_id?: string;
  type: 'link' | 'image' | 'note';
  title: string;
  description?: string;
  url?: string;
  image?: string;
  favicon?: string;
  domain?: string;
  tags?: string[];
  pinned?: boolean;
  created_at: string;
}

export interface ClipPayload {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  tags?: string[];
  domain?: string;
}

export interface ScrapedData {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  domain?: string;
}