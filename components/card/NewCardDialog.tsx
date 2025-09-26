'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { CardItem } from '@/lib/types'
import { addUserCard } from '@/lib/local-storage'
import { useSession } from 'next-auth/react'

interface NewCardDialogProps {
  onCardAdded: (card: CardItem) => void
}

export function NewCardDialog({ onCardAdded }: NewCardDialogProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!session?.user?.id) {
      setError('Please sign in to create cards')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create a simple card directly in localStorage
      const newCard: CardItem = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: session.user.id,
        type: 'link',
        title: new URL(url.trim()).hostname || 'New Card',
        description: `Card created from ${url.trim()}`,
        url: url.trim(),
        domain: new URL(url.trim()).hostname,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        created_at: new Date().toISOString(),
        pinned: false
      }

      addUserCard(session.user.id, newCard)
      onCardAdded(newCard)
      
      // Reset form and close dialog
      setUrl('')
      setTags('')
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              placeholder="Enter a URL to bookmark..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              We'll automatically fetch the title, description, and image for you.
            </p>
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Tags (optional, comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Add tags to help organize your cards (e.g., "work, design, inspiration")
            </p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Card'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
