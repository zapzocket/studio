
import { Loader2 } from 'lucide-react';

export default function LoadingArticle() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-primary mb-4" />
      <p className="text-lg sm:text-xl text-muted-foreground">در حال بارگذاری مقاله...</p>
    </div>
  );
}
