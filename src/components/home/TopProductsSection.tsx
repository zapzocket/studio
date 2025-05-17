
'use client'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';

// Mock data for products
const topProducts: Product[] = [
  { id: '1', name: 'غذای خشک سگ پرمیوم رویال کنین', image: 'https://placehold.co/300x200.png', imageHint: 'dog food bag', price: '320,000', category: 'dog' },
  { id: '2', name: 'اسباب بازی گربه با پر و زنگوله', image: 'https://placehold.co/300x200.png', imageHint: 'cat toy feather', price: '85,000', category: 'cat' },
  { id: '3', name: 'ظرف آب خودکار هوشمند برای سگ و گربه', image: 'https://placehold.co/300x200.png', imageHint: 'pet water fountain', price: '145,000', category: 'dog' },
  { id: '4', name: 'محل خواب نرم و راحت برای گربه', image: 'https://placehold.co/300x200.png', imageHint: 'cat bed', price: '220,000', category: 'cat' },
];

const TopProductsSection = () => {
  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // Here you would typically update a global cart state
    // For now, ProductCard itself shows a toast.
  };
  
  return (
    <section className="py-12 sm:py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center sm:text-right">محصولات پرفروش</h2>
          <Link href="/products" className="text-primary hover:text-primary/80 font-medium flex items-center text-sm sm:text-base self-center sm:self-auto">
            مشاهده همه <ArrowLeft size={18} className="me-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProductsSection;

