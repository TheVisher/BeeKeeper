import { CardItem } from './types'

// Local storage key prefix for user cards
const CARDS_STORAGE_PREFIX = 'beekeeper_cards_'

/**
 * Get the storage key for a user's cards
 */
function getUserCardsKey(userId: string): string {
  return `${CARDS_STORAGE_PREFIX}${userId}`
}

/**
 * Get all cards for a user from localStorage
 */
export function getUserCards(userId: string): CardItem[] {
  try {
    if (typeof window === 'undefined') {
      // Server-side: return empty array
      return []
    }
    
    const key = getUserCardsKey(userId)
    const stored = localStorage.getItem(key)
    
    if (!stored) {
      return []
    }
    
    const cards = JSON.parse(stored)
    return Array.isArray(cards) ? cards : []
  } catch (error) {
    console.error('Error reading cards from localStorage:', error)
    return []
  }
}

/**
 * Save all cards for a user to localStorage
 */
export function saveUserCards(userId: string, cards: CardItem[]): void {
  try {
    if (typeof window === 'undefined') {
      // Server-side: do nothing
      return
    }
    
    const key = getUserCardsKey(userId)
    localStorage.setItem(key, JSON.stringify(cards))
  } catch (error) {
    console.error('Error saving cards to localStorage:', error)
  }
}

/**
 * Add a new card for a user
 */
export function addUserCard(userId: string, card: CardItem): CardItem {
  const cards = getUserCards(userId)
  const newCard = {
    ...card,
    id: card.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: card.created_at || new Date().toISOString()
  }
  
  cards.unshift(newCard) // Add to beginning
  saveUserCards(userId, cards)
  
  return newCard
}

/**
 * Update an existing card for a user
 */
export function updateUserCard(userId: string, cardId: string, updates: Partial<CardItem>): CardItem | null {
  const cards = getUserCards(userId)
  const cardIndex = cards.findIndex(card => card.id === cardId)
  
  if (cardIndex === -1) {
    return null
  }
  
  const updatedCard = {
    ...cards[cardIndex],
    ...updates,
    id: cardId // Ensure ID doesn't change
  }
  
  cards[cardIndex] = updatedCard
  saveUserCards(userId, cards)
  
  return updatedCard
}

/**
 * Delete a card for a user
 */
export function deleteUserCard(userId: string, cardId: string): boolean {
  const cards = getUserCards(userId)
  const cardIndex = cards.findIndex(card => card.id === cardId)
  
  if (cardIndex === -1) {
    return false
  }
  
  cards.splice(cardIndex, 1)
  saveUserCards(userId, cards)
  
  return true
}

/**
 * Get a specific card by ID for a user
 */
export function getUserCard(userId: string, cardId: string): CardItem | null {
  const cards = getUserCards(userId)
  return cards.find(card => card.id === cardId) || null
}
