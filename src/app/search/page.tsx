import SearchResults from '@/components/search/SearchResults';
import { Suspense } from 'react';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Suspense is important here because SearchResults uses useSearchParams */}
      <Suspense fallback={<div className="text-center py-10">در حال بارگذاری نتایج جستجو...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
