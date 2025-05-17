import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PromotionalBanner = () => {
  return (
    <section className="py-6 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-lg md:text-xl font-medium mb-3 md:mb-0">۲۰٪ تخفیف تخت و بالش‌های حیوانات</p>
        <Button asChild variant="outline" className="border-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 py-2 rounded-lg font-medium transition duration-300">
          <Link href="/products?promo=beds">مشاهده تخفیف‌ها</Link>
        </Button>
      </div>
    </section>
  );
};

export default PromotionalBanner;
