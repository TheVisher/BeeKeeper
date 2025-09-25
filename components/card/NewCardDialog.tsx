'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { CardItem } from '@/lib/types'

interface NewCardDialogProps {
  onCardAdded: (card: CardItem) => void
}

export function NewCardDialog({ onCardAdded }: NewCardDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create card')
      }

      const newCard = await response.json()
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
