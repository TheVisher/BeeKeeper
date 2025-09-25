import { CardItem } from './types';

// Simple in-memory storage for demo mode
// In a real app, this would be replaced with database storage
let demoCards: CardItem[] = [
  {
    id: "1",
    url: "https://mymind.com",
    title: "MyMind – The simplest way to save what matters",
    description: "Save links, images, and notes beautifully organized.",
    image: "https://mymind.com/og-image.jpg",
    favicon: "https://mymind.com/favicon.ico",
    type: "link",
    tags: ["pkm", "inspiration"],
    created_at: new Date("2023-10-25").toISOString(),
    domain: "mymind.com",
  },
  {
    id: "2",
    url: "https://tailwindcss.com",
    title: "Tailwind CSS",
    description: "Rapidly build modern websites without ever leaving your HTML.",
    image: "https://tailwindcss.com/og-image.png",
    favicon: "https://tailwindcss.com/favicon.ico",
    type: "link",
    tags: ["dev", "design"],
    created_at: new Date("2023-10-24").toISOString(),
    domain: "tailwindcss.com",
  },
  {
    id: "3",
    url: "https://nextjs.org",
    title: "Next.js – The React Framework",
    description: "Production-ready fullstack React framework.",
    image: "https://nextjs.org/og.png",
    favicon: "https://nextjs.org/favicon.ico",
    type: "link",
    tags: ["react", "framework"],
    created_at: new Date("2023-10-23").toISOString(),
    domain: "nextjs.org",
  },
];

export function getDemoCards(): CardItem[] {
  return [...demoCards].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function addDemoCard(card: CardItem): void {
  demoCards.unshift(card);
}

export function updateDemoCard(id: string, updates: Partial<CardItem>): CardItem | null {
  const index = demoCards.findIndex(card => card.id === id);
  if (index === -1) return null;
  
  demoCards[index] = { ...demoCards[index], ...updates };
  return demoCards[index];
}

export function deleteDemoCard(id: string): boolean {
  const index = demoCards.findIndex(card => card.id === id);
  if (index === -1) return false;
  
  demoCards.splice(index, 1);
  return true;
}
