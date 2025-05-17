
'use client';

import Link from 'next/link';
import { Dog, Cat, Bird, Rabbit } from 'lucide-react'; // Rabbit for Jונדگان (Rodents/Small Pets)
import type { CategoryInfo } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

const categories: CategoryInfo[] = [
  { id: 'dog', name: 'سگ', icon: Dog, bgColorClass: 'bg-primary/10', iconColorClass: 'text-primary', href: '/products?category=dog' },
  { id: 'cat', name: 'گربه', icon: Cat, bgColorClass: 'bg-accent/20', iconColorClass: 'text-accent', href: '/products?category=cat' },
  { id: 'bird', name: 'پرندگان', icon: Bird, bgColorClass: 'bg-sky-100', iconColorClass: 'text-sky-500', href: '/products?category=bird' }, // Using sky for blue
  { id: 'rodent', name: 'جوندگان', icon: Rabbit, bgColorClass: 'bg-amber-100', iconColorClass: 'text-amber-500', href: '/products?category=rodent' }, // Using amber for yellow
];

const CategoriesSection = () => {
  const isMobile = useIsMobile(); // Use the hook
  const iconSize = isMobile ? 40 : 48; // Determine icon size

  return (
    <section className="py-10 sm:py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">دسته‌بندی محصولات</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <Link href={category.href} key={category.id} className="flex flex-col items-center group">
              <div className={`category-circle ${category.bgColorClass} group-hover:shadow-xl group-hover:scale-105 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]`}>
                <category.icon size={iconSize} className={category.iconColorClass} />
              </div>
              <span className="mt-3 sm:mt-4 font-medium text-sm sm:text-base text-foreground">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
