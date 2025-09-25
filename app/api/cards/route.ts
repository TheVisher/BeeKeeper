import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateClipPayload, enrichClipPayload } from '@/lib/scrape'
import { CardItem } from '@/lib/types'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 501 })
    }

    const { data: cards, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cards:', error)
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
    }

    return NextResponse.json(cards || [])
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // dev bypass (local only)
    const allowDev = process.env.ALLOW_DEV_HEADER === 'true'
    const devUserId = process.env.DEV_USER_ID
    
    let userId: string | null = null
    
    if (allowDev) {
      const h = request.headers.get('x-dev-user-id') || devUserId || null
      if (h) {
        userId = h
        console.log('Using dev user ID:', h)
      }
    }
    
    // Fallback to real session if no dev header
    if (!userId) {
      const session = await getServerSession(authOptions)
      userId = session?.user?.id ?? null
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 501 })
    }

    // Parse and validate request body
    const body = await request.json()
    
    // If only URL is provided, use the new scraping functionality
    if (body.url && !body.title && !body.description) {
      const validatedPayload = validateClipPayload(body)
      const enrichedPayload = await enrichClipPayload(validatedPayload)
      
      // Determine card type based on URL
      let cardType: 'link' | 'image' | 'note' = 'link'
      if (enrichedPayload.url) {
        const url = new URL(enrichedPayload.url)
        const pathname = url.pathname.toLowerCase()
        
        // Check if it's an image URL
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico']
        if (imageExtensions.some(ext => pathname.endsWith(ext))) {
          cardType = 'image'
        }
      }
      
      const cardData = {
        user_id: userId,
        url: enrichedPayload.url,
        title: enrichedPayload.title || 'Untitled',
        description: enrichedPayload.description || null,
        image: enrichedPayload.image || null,
        favicon: enrichedPayload.favicon || null,
        domain: enrichedPayload.domain || null,
        type: cardType,
        tags: enrichedPayload.tags || [],
        pinned: false
      }

      const { data: card, error } = await supabaseAdmin
        .from('cards')
        .insert(cardData)
        .select()
        .single()

      if (error) {
        console.error('Error creating card:', error)
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
      }

      // Transform the database result to match CardItem interface
      const savedCard: CardItem = {
        id: card.id,
        user_id: card.user_id,
        type: card.type,
        title: card.title,
        description: card.description,
        url: card.url,
        image: card.image,
        favicon: card.favicon,
        domain: card.domain,
        tags: card.tags,
        pinned: card.pinned,
        created_at: card.created_at
      }

      return NextResponse.json(savedCard, { status: 201 })
    }
    
    // Legacy behavior for manually provided data
    const cardData = {
      user_id: userId,
      url: body.url || '',
      title: body.title || '',
      description: body.description || '',
      image: body.image || null,
      favicon: body.favicon || null,
      domain: body.domain || null,
      type: body.type || 'link',
      tags: body.tags || [],
      pinned: false
    }

    const { data: card, error } = await supabaseAdmin
      .from('cards')
      .insert(cardData)
      .select()
      .single()

    if (error) {
      console.error('Error creating card:', error)
      return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
    }

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
