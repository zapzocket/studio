import { Loader2 } from 'lucide-react';

export default function LoadingSearchResults() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl text-muted-foreground">در حال جستجو...</p>
    </div>
  );
}
