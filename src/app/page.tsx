import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import TopProductsSection from '@/components/home/TopProductsSection';
import ArticlesSection from '@/components/home/ArticlesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <PromotionalBanner />
      <TopProductsSection />
      <ArticlesSection />
      <TestimonialsSection />
    </>
  );
}
