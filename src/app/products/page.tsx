
import PartnerProductList from '@/components/products/PartnerProductList';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">محصولات فروشندگان همکار</h1>
      {/* Suspense is important here because PartnerProductList now uses useSearchParams */}
      <Suspense fallback={<div className="text-center py-10">در حال بارگذاری محصولات...</div>}>
        <PartnerProductList />
      </Suspense>
    </div>
  );
}
