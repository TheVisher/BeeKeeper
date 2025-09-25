import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { updateDemoCard, deleteDemoCard } from '@/lib/demo-storage'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      // Demo mode: handle updates in memory
      const cardId = params.id
      const body = await request.json()
      
      const updateData: any = {}
      if (body.title !== undefined) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.tags !== undefined) updateData.tags = body.tags
      if (body.pinned !== undefined) updateData.pinned = body.pinned
      
      const updatedCard = updateDemoCard(cardId, updateData)
      
      if (!updatedCard) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 })
      }
      
      return NextResponse.json(updatedCard)
    }

    const cardId = params.id
    const body = await request.json()
    
    // Validate that the card belongs to the user
    const { data: existingCard, error: fetchError } = await supabaseAdmin
      .from('cards')
      .select('user_id')
      .eq('id', cardId)
      .single()

    if (fetchError || !existingCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    if (existingCard.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update the card with provided fields
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.pinned !== undefined) updateData.pinned = body.pinned

    const { data: updatedCard, error: updateError } = await supabaseAdmin
      .from('cards')
      .update(updateData)
      .eq('id', cardId)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating card:', updateError)
      return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
    }

    return NextResponse.json(updatedCard)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      // Demo mode: handle deletes in memory
      const cardId = params.id
      
      const success = deleteDemoCard(cardId)
      
      if (!success) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true })
    }

    const cardId = params.id

    // Validate that the card belongs to the user and delete it
    const { data: deletedCard, error: deleteError } = await supabaseAdmin
      .from('cards')
      .delete()
      .eq('id', cardId)
      .eq('user_id', userId)
      .select()
      .single()

    if (deleteError || !deletedCard) {
      return NextResponse.json({ error: 'Card not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ success: true, deletedCard })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
