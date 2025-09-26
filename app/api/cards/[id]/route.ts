import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CardItem } from '@/lib/types'
import { getUserCard, updateUserCard, deleteUserCard } from '@/lib/local-storage'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const cardId = params.id

    // Update the card
    const updatedCard = updateUserCard(session.user.id, cardId, body)
    
    if (!updatedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCard)
  } catch (error) {
    console.error('Error in PATCH /api/cards/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cardId = params.id

    // Delete the card
    const success = deleteUserCard(session.user.id, cardId)
    
    if (!success) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/cards/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}