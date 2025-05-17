
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Mock data - in a real app, this would come from an API
const mockPartnerProducts: Product[] = [
  { id: 'p1', name: 'قلاده چرمی دست‌دوز سگ', image: 'https://placehold.co/300x200.png', imageHint: 'leather dog collar', price: '180,000', category: 'dog', isFavorite: false },
  { id: 'p2', name: 'خاک گربه آنتی‌باکتریال ۱۰ کیلویی', image: 'https://placehold.co/300x200.png', imageHint: 'cat litter bag', price: '250,000', category: 'cat', isFavorite: true },
  { id: 'p3', name: 'قفس بزرگ برای پرندگان زینتی', image: 'https://placehold.co/300x200.png', imageHint: 'bird cage', price: '750,000', category: 'bird', isFavorite: false },
  { id: 'p4', name: 'غذای مخصوص همستر پریمیوم', image: 'https://placehold.co/300x200.png', imageHint: 'hamster food', price: '95,000', category: 'rodent', isFavorite: false },
  { id: 'p5', name: 'فیلتر داخلی آکواریوم قدرتمند', image: 'https://placehold.co/300x200.png', imageHint: 'aquarium filter', price: '320,000', category: 'fish', isFavorite: true },
  { id: 'p6', name: 'تشویقی دنتال سگ با طعم نعنا', image: 'https://placehold.co/300x200.png', imageHint: 'dog dental treat', price: '120,000', category: 'dog', isFavorite: false },
];

const categories = [
  { id: 'all', name: 'همه دسته‌بندی‌ها' },
  { id: 'dog', name: 'سگ' },
  { id: 'cat', name: 'گربه' },
  { id: 'bird', name: 'پرندگان' },
  { id: 'rodent', name: 'جوندگان' },
  { id: 'fish', name: 'ماهی' },
];

const validCategoryIds = categories.map(c => c.id).filter(id => id !== 'all');

export default function PartnerProductList() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>(mockPartnerProducts);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialCategory && validCategoryIds.includes(initialCategory)) {
      return initialCategory;
    }
    return 'all';
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && validCategoryIds.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else if (!categoryFromUrl) {
      // If the category param is removed or not present, default to 'all'
      // This handles cases where user might clear filters or navigate directly
      setSelectedCategory('all');
    }
    // Only re-run if searchParams.get('category') changes.
    // Note: useSearchParams() itself is stable, its .get() method provides the changing value.
  }, [searchParams]);


  const filteredProducts = useMemo(() => {
    return products
      .filter(product =>
        selectedCategory === 'all' || product.category === selectedCategory
      )
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart from partner list:", product.name);
    // ProductCard shows its own toast
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="جستجو در محصولات..."
          className="md:flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart}/>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg py-10">
          محصولی با این مشخصات یافت نشد.
        </p>
      )}
    </div>
  );
}
