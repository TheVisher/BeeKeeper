import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateClipPayload } from '@/lib/scrape'
import { CardItem } from '@/lib/types'
import { addUserCard } from '@/lib/local-storage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedPayload = validateClipPayload(body)
    
    // Skip enrichment to avoid external API calls - use simple data
    const enrichedPayload = {
      ...validatedPayload,
      title: validatedPayload.title || 'New Card',
      description: validatedPayload.description || 'Card created from URL',
      domain: validatedPayload.url ? new URL(validatedPayload.url).hostname : null
    }
    
    // Determine card type based on URL
    let cardType: 'link' | 'image' | 'note' = 'link'
    if (enrichedPayload.url) {
      try {
        const url = new URL(enrichedPayload.url)
        const pathname = url.pathname.toLowerCase()
        
        // Check if it's an image URL
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico']
        if (imageExtensions.some(ext => pathname.endsWith(ext))) {
          cardType = 'image'
        }
      } catch (error) {
        // Invalid URL, treat as note
        cardType = 'note'
      }
    } else {
      cardType = 'note'
    }
    
    // Create new card
    const newCard: CardItem = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: session.user.id,
      type: cardType,
      title: enrichedPayload.title || 'Untitled',
      description: enrichedPayload.description || null,
      url: enrichedPayload.url,
      image: enrichedPayload.image || null,
      favicon: enrichedPayload.favicon || null,
      domain: enrichedPayload.domain || null,
      tags: enrichedPayload.tags || [],
      pinned: false,
      created_at: new Date().toISOString()
    }
    
    // Save to localStorage
    const savedCard = addUserCard(session.user.id, newCard)
    
    return NextResponse.json(savedCard, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/clip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}