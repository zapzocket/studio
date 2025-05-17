import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  // The Unsplash URL from the original HTML for the background
  const heroBgImageUrl = "https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
  
  return (
    <section 
      className="hero-section text-right py-16 md:py-32"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('${heroBgImageUrl}')`,
      }}
      data-ai-hint="pets background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">فروش انواع لوازم حیوانات خانگی</h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground">کیفیت برتر، قیمت مناسب، ارسال فوری</p>
          <Button asChild size="lg" className="px-8 py-3 rounded-xl font-medium text-lg shadow-md">
            <Link href="/products">خرید کنید</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
