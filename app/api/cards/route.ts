import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CardItem } from '@/lib/types'
import { getUserCards, addUserCard } from '@/lib/local-storage'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's cards from localStorage
    const cards = getUserCards(session.user.id)
    
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error in GET /api/cards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.url && !body.title) {
      return NextResponse.json({ error: 'URL or title is required' }, { status: 400 })
    }

    // Determine card type based on URL
    let cardType: 'link' | 'image' | 'note' = 'link'
    if (body.url) {
      try {
        const url = new URL(body.url)
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
      title: body.title || 'Untitled',
      description: body.description || null,
      url: body.url || null,
      image: body.image || null,
      favicon: body.favicon || null,
      domain: body.url ? new URL(body.url).hostname : null,
      tags: body.tags || [],
      pinned: false,
      created_at: new Date().toISOString()
    }

    // Save to localStorage
    const savedCard = addUserCard(session.user.id, newCard)
    
    return NextResponse.json(savedCard, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/cards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}