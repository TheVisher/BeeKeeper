'use client';
// Fix: Import React to use React.FC for proper component typing.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ExternalLink, Copy, Edit, Pin, Link as LinkIcon, Type, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { updateUserCard, deleteUserCard } from '@/lib/local-storage';


interface FlipCardProps {
    item: CardItem;
    userId?: string;
    onPin?: (id: string) => void;
    onEdit?: (id: string) => void;
    onUpdate?: (updatedCard: CardItem) => void;
    onDelete?: (id: string) => void;
}

const cardVariants = {
    initial: { rotateY: 0 },
    flipped: { rotateY: 180 },
};

const cardContentVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.15, duration: 0.2 } },
};

// Fix: Changed component to a const typed with React.FC to ensure it's correctly recognized as a React component, resolving the `key` prop error.
export const FlipCard: React.FC<FlipCardProps> = ({ item, userId, onPin, onEdit, onUpdate, onDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editDescription, setEditDescription] = useState(item.description || '');
    const [editTags, setEditTags] = useState(item.tags?.join(', ') || '');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    // Check if we have the required handlers (indicates authenticated user)
    const isAuthenticated = !!(onUpdate && onDelete);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleFlip();
        } else if (event.key === 'o' && item.url) {
            event.preventDefault();
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    };

    const handlePin = () => {
        if (!onUpdate || !isAuthenticated || !userId) {
            addToast({
                type: 'warning',
                title: 'Sign in required',
                description: 'Please sign in to pin cards.'
            });
            return;
        }
        
        try {
            const updatedCard = updateUserCard(userId, item.id, { pinned: !item.pinned });
            
            if (!updatedCard) {
                throw new Error('Failed to update pin status');
            }

            onUpdate(updatedCard);
            addToast({
                type: 'success',
                title: updatedCard.pinned ? 'Card pinned' : 'Card unpinned',
                description: `"${updatedCard.title}" has been ${updatedCard.pinned ? 'pinned' : 'unpinned'}.`
            });
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Failed to update pin status. Please try again.'
            });
        }
    };

    const handleEdit = () => {
        if (!isAuthenticated) {
            // In demo mode, allow editing for demonstration purposes
            addToast({
                type: 'info',
                title: 'Demo Mode',
                description: 'This is a demo edit. Sign in to save changes permanently.'
            });
        }
        setIsEditing(true);
        setEditTitle(item.title);
        setEditDescription(item.description || '');
        setEditTags(item.tags?.join(', ') || '');
    };

    const handleSaveEdit = () => {
        if (!isAuthenticated || !userId) {
            addToast({
                type: 'warning',
                title: 'Sign in required',
                description: 'Please sign in to edit cards.'
            });
            return;
        }

        if (!onUpdate) {
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Update handler not available.'
            });
            return;
        }

        try {
            const tags = editTags.split(',').map(tag => tag.trim()).filter(Boolean);
            
            const updatedCard = updateUserCard(userId, item.id, {
                title: editTitle,
                description: editDescription,
                tags: tags
            });

            if (!updatedCard) {
                throw new Error('Failed to update card');
            }

            onUpdate(updatedCard);
            setIsEditing(false);
            addToast({
                type: 'success',
                title: 'Card updated',
                description: 'Your changes have been saved.'
            });
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Failed to update card. Please try again.'
            });
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditTitle(item.title);
        setEditDescription(item.description || '');
        setEditTags(item.tags?.join(', ') || '');
    };

    const handleDelete = () => {
        if (!onDelete || !isAuthenticated || !userId) {
            addToast({
                type: 'warning',
                title: 'Sign in required',
                description: 'Please sign in to delete cards.'
            });
            return;
        }
        
        if (!confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const success = deleteUserCard(userId, item.id);

            if (!success) {
                throw new Error('Failed to delete card');
            }

            onDelete(item.id);
            addToast({
                type: 'success',
                title: 'Card deleted',
                description: `"${item.title}" has been deleted.`
            });
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Error',
                description: 'Failed to delete card. Please try again.'
            });
        }
    };
    
    const CardIcon = item.type === 'link' ? LinkIcon : item.type === 'image' ? ImageIcon : Type;

    return (
        <div className="perspective-1000 rounded-2xl overflow-hidden w-full h-full min-h-[320px]">
            <motion.div
                className="relative preserve-3d cursor-pointer w-full h-full flip-card"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={handleFlip}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label={`${item.title} card. Press Enter or Space to flip, O to open.`}
            >
                {/* FRONT */}
                <div
                    className="absolute inset-0 backface-hidden bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg flex flex-col"
                    style={{ transform: "rotateY(0deg) translateZ(0.01px)" }}
                >
                    {item.image && (
                        <img 
                            src={`/api/proxy-image?url=${encodeURIComponent(item.image)}`} 
                            alt={item.title} 
                            className="rounded-t-lg w-full h-40 object-cover" 
                        />
                    )}
                    <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 flex-grow">{item.description}</p>
                        
                        <div className="mt-auto pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {item.favicon && (
                                    <Image 
                                        src={`/api/proxy-image?url=${encodeURIComponent(item.favicon)}`} 
                                        alt="" 
                                        width={16} 
                                        height={16} 
                                        className="rounded-sm" 
                                    />
                                )}
                                <span>{item.domain || 'Note'}</span>
                            </div>
                             <CardIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div
                    className="absolute inset-0 backface-hidden bg-card/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-4 flex flex-col"
                    style={{ transform: "rotateY(180deg) translateZ(0.01px)" }}
                >
                    {isEditing ? (
                        <div className="flex-grow overflow-y-auto pr-2" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full bg-input rounded-md p-2 text-sm border border-input"
                                        placeholder="Card title"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full bg-input rounded-md p-2 text-sm min-h-[60px] border border-input"
                                        placeholder="Card description"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tags</label>
                                    <input
                                        type="text"
                                        value={editTags}
                                        onChange={(e) => setEditTags(e.target.value)}
                                        className="w-full bg-input rounded-md p-2 text-sm border border-input"
                                        placeholder="tag1, tag2, tag3"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto pr-2">
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{item.title}</h4>
                                {item.pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {item.tags?.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex-shrink-0 pt-3 border-t border-white/10 mt-2">
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                           <span>{new Date(item.created_at).toLocaleDateString()}</span>
                           <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                        </div>
                        
                        {isEditing ? (
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={handleCancelEdit}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={handleSaveEdit}
                                    disabled={isLoading || !editTitle.trim()}
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                {isAuthenticated ? (
                                    <>
                                        <Button 
                                            variant={item.pinned ? "default" : "secondary"} 
                                            size="sm" 
                                            className="w-full"
                                            onClick={handlePin}
                                            disabled={isLoading}
                                        >
                                            <Pin className="w-4 h-4 mr-2" /> 
                                            {item.pinned ? 'Unpin' : 'Pin'}
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={handleEdit}
                                            disabled={isLoading}
                                        >
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="col-span-1">
                                                <Button variant="secondary" size="sm" className="w-full">
                                                    <ExternalLink className="w-4 h-4 mr-2" /> Open
                                                </Button>
                                            </a>
                                        )}
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="col-span-1"
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="w-full opacity-50"
                                            onClick={() => {
                                                addToast({
                                                    type: 'info',
                                                    title: 'Demo Mode',
                                                    description: 'Sign in to pin, edit, and delete cards.'
                                                });
                                            }}
                                        >
                                            <Pin className="w-4 h-4 mr-2" /> Pin
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={handleEdit}
                                        >
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="col-span-1">
                                                <Button variant="secondary" size="sm" className="w-full">
                                                    <ExternalLink className="w-4 h-4 mr-2" /> Open
                                                </Button>
                                            </a>
                                        )}
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            className="col-span-1 opacity-50"
                                            onClick={() => {
                                                addToast({
                                                    type: 'info',
                                                    title: 'Demo Mode',
                                                    description: 'Sign in to pin, edit, and delete cards.'
                                                });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* invisible spacer to give height */}
                <div className="invisible select-none">
                    <div className="h-40" />
                    <div className="p-4">.</div>
                </div>
            </motion.div>
        </div>
    );
}