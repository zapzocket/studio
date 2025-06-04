
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { toast } from '@/hooks/use-toast'; // For error notifications

// Mock data removed

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

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setSelectedCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Map backend data to frontend Product type
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: String(p.product_id), // Ensure id is string
          name: p.itemName,
          price: String(p.price), // Ensure price is string
          category: p.category,
          description: p.description,
          // These fields are not in the backend model, so provide defaults or leave undefined
          image: `https://placehold.co/300x200.png?text=${encodeURIComponent(p.itemName)}`, // Placeholder image
          imageHint: p.itemName,
          isFavorite: false, // Default value
        }));
        setProducts(mappedProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        toast({
          title: "خطا در بارگذاری محصولات",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []); // Empty dependency array to run once on mount

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
    // This will be handled by ProductCard itself or a global cart context later
    console.log("Triggered add to cart from partner list for:", product.name);
    // For now, ProductCard might show its own toast.
    // If cart context is implemented, dispatch an action here.
  };

  if (isLoading) {
    return <div className="text-center py-10">در حال بارگذاری محصولات...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">خطا در بارگذاری محصولات: {error}</div>;
  }

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
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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
