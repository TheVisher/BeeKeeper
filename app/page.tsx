import { CardGrid } from '@/components/card/CardGrid';
import { CardItem } from '@/lib/types';
import { AuthButton } from '@/components/auth/AuthButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getDemoCards } from '@/lib/demo-storage';


async function getUserCards(userId: string): Promise<CardItem[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const { data: cards, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }

    return cards || [];
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return [];
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  // Load user cards if authenticated and database is configured
  let userCards: CardItem[] = [];
  if (session?.user?.id && supabaseAdmin) {
    userCards = await getUserCards(session.user.id);
  }
  
  // In demo mode, also try to load dev user cards
  let devUserCards: CardItem[] = [];
  if (!session?.user?.id && supabaseAdmin) {
    try {
      const devUserId = process.env.DEV_USER_ID || 'demo-user-123';
      devUserCards = await getUserCards(devUserId);
    } catch (error) {
      console.log('No dev user cards found');
    }
  }
  
      // Use user cards if available, otherwise combine dev user cards with demo cards
      const demoCards = getDemoCards();
      const cardsToShow = userCards.length > 0 ? userCards : [...devUserCards, ...demoCards];
  
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col items-center text-center">
        <div className="w-full flex justify-between items-center mb-4">
          <div></div>
          <AuthButton />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Capture. Card. Recall.</h1>
        <p className="text-muted-foreground mt-2">Your digital memory, beautifully organized.</p>
      </header>

      <CardGrid items={cardsToShow} />
    </main>
  );
}