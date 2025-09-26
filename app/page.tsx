import { CardGrid } from '@/components/card/CardGrid';
import { CardItem } from '@/lib/types';
import { AuthButton } from '@/components/auth/AuthButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
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

      <CardGrid items={[]} />
    </main>
  );
}