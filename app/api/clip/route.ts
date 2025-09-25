import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateClipPayload, enrichClipPayload } from '@/lib/scrape'
import { CardItem } from '@/lib/types'
import { addDemoCard } from '@/lib/demo-storage'

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
      // Demo mode: return a mock card without saving to database
      const body = await request.json()
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
      
      // Create and store a mock card for demo mode
      const mockCard: CardItem = {
        id: `demo-${Date.now()}`,
        user_id: userId,
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
      
      // Store the card in demo storage
      addDemoCard(mockCard)
      
      return NextResponse.json(mockCard, { status: 201 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedPayload = validateClipPayload(body)
    
    // Enrich payload with scraped data if needed
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
    
    // Prepare card data for database insertion
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

    // Insert card into database
    const { data: card, error } = await supabaseAdmin
      .from('cards')
      .insert(cardData)
      .select()
      .single()

    if (error) {
      console.error('Error creating card:', error)
      return NextResponse.json({ 
        error: 'Failed to create card', 
        message: error.message 
      }, { status: 500 })
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
    
  } catch (error: any) {
    console.error('API Error:', error)
    
    // Handle validation errors
    if (error.message === 'URL is required' || error.message === 'Invalid URL format') {
      return NextResponse.json({ 
        error: 'Invalid request', 
        message: error.message 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: 'An unexpected error occurred' 
    }, { status: 500 })
  }
}