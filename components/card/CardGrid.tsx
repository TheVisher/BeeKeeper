'use client';

// Fix: Import React to resolve type errors for React.ElementType and React.FormEvent.
import React, { useState, useMemo } from 'react';
import { FlipCard } from './FlipCard';
import { CardItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Link as LinkIcon, Image, Type, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { NewCardDialog } from './NewCardDialog';
import { CardSkeleton } from '@/components/ui/skeleton';

type FilterType = 'all' | CardItem['type'];

const FILTERS: { label: string, value: FilterType, icon: React.ElementType }[] = [
    { label: 'All', value: 'all', icon: () => null },
    { label: 'Links', value: 'link', icon: LinkIcon },
    { label: 'Images', value: 'image', icon: Image },
    { label: 'Notes', value: 'note', icon: Type },
];

export function CardGrid({ items: initialItems }: { items: CardItem[] }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CardItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (activeFilter === 'all') return true;
        return item.type === activeFilter;
      })
      .filter((item) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.url?.toLowerCase().includes(searchLower) ||
          item.domain?.toLowerCase().includes(searchLower) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      })
          .map(item => ({
            ...item,
            // Calculate dynamic row span based on content length - more reasonable heights
            rowSpan: Math.max(24, Math.min(32, 24 + Math.floor((item.description?.length || 0) / 30)))
          }));
  }, [items, searchTerm, activeFilter]);
  
  const handleAddCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCard: CardItem = {
      id: String(Date.now()),
      type: formData.get('type') as CardItem['type'] || 'note',
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string,
      tags: (formData.get('tags') as string || '').split(',').map(tag => tag.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    };
    setItems(prev => [newCard, ...prev]);
    setDialogOpen(false);
  };

  const handleNewCardAdded = (newCard: CardItem) => {
    setItems(prev => [newCard, ...prev]);
  };

  const handleCardUpdate = (updatedCard: CardItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedCard.id ? updatedCard : item
    ));
  };

  const handleCardDelete = (cardId: string) => {
    setItems(prev => prev.filter(item => item.id !== cardId));
  };


  return (
    <div>
      {!session && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-600 text-sm">
            🐝 <strong>Demo Mode:</strong> You're viewing sample cards. 
            <Link href="/login" className="underline ml-1">Sign in</Link> to create and manage your own cards!
          </p>
        </div>
      )}
      
      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by title, description, URL, domain, or tags..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
            {FILTERS.map(({ label, value, icon: Icon }) => (
                <Badge
                    key={value}
                    variant={activeFilter === value ? 'default' : 'secondary'}
                    onClick={() => setActiveFilter(value)}
                    className="cursor-pointer text-sm"
                >
                    {label}
                </Badge>
            ))}
        </div>
            <div className="sm:ml-auto">
              {session ? (
                <NewCardDialog onCardAdded={handleNewCardAdded} />
              ) : (
                <Link href="/login">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Sign in to Add Cards
                  </Button>
                </Link>
              )}
            </div>
      </div>
      
      {/* Masonry Grid */}
      <div className="masonry-grid">
        {isLoading ? (
          // Show skeleton loading states
          Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="masonry-item">
              <CardSkeleton />
            </div>
          ))
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="masonry-item"
              style={{ '--row-span': (item as any).rowSpan } as React.CSSProperties}
            >
              <FlipCard 
                item={item} 
                onUpdate={session ? handleCardUpdate : undefined}
                onDelete={session ? handleCardDelete : undefined}
              />
            </div>
          ))
        )}
      </div>
       {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No cards found.</p>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}