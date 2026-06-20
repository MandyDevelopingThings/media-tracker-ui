'use client';

import Link from 'next/link';
import { UserX, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProfileErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProfileError({ error }: ProfileErrorProps) {
  const isNotFound =
    error.message.toLowerCase().includes('not found') ||
    error.digest?.includes('404');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <UserX className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">
          {isNotFound ? 'Perfil não encontrado' : 'Algo deu errado'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isNotFound
            ? 'Este perfil não existe ou foi removido.'
            : 'Ocorreu um erro ao carregar o perfil. Tente novamente.'}
        </p>
      </div>
      <Link
        href="/"
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
          'border border-border bg-card text-foreground',
          'transition-colors duration-200 hover:border-primary/40 hover:bg-accent',
        )}
      >
        <Home className="h-4 w-4" />
        Voltar para o início
      </Link>
    </div>
  );
}
