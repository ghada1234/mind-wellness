import { Heart } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2 font-headline text-lg font-bold">
      <Heart className="size-6 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 truncate text-foreground">
        Find Your Inner Peace
      </span>
    </div>
  );
}
