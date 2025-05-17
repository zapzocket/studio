'use client'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';

// Mock data for products
const topProducts: Product[] = [
  { id: '1', name: 'غذای خشک سگ پرمیوم رویال کنین', image: 'https://placehold.co/300x200.png', imageHint: 'dog food bag', price: '320,000' },
  { id: '2', name: 'اسباب بازی گربه با پر و زنگوله', image: 'https://placehold.co/300x200.png', imageHint: 'cat toy feather', price: '85,000' },
  { id: '3', name: 'ظرف آب خودکار هوشمند برای سگ و گربه', image: 'https://placehold.co/300x200.png', imageHint: 'pet water fountain', price: '145,000' },
  { id: '4', name: 'محل خواب نرم و راحت برای گربه', image: 'https://placehold.co/300x200.png', imageHint: 'cat bed', price: '220,000' },
];

const TopProductsSection = () => {
  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product.name);
    // Here you would typically update a global cart state
    // For now, ProductCard itself shows a toast.
  };
  
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">محصولات پرفروش</h2>
          <Link href="/products" className="text-primary hover:text-primary/80 font-medium flex items-center">
            مشاهده همه <ArrowLeft size={20} className="me-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProductsSection;
