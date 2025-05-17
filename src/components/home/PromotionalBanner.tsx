
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PromotionalBanner = () => {
  return (
    <section className="py-4 sm:py-6 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 flex flex-col text-center sm:flex-row sm:text-right justify-between items-center">
        <p className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-0">۲۰٪ تخفیف تخت و بالش‌های حیوانات</p>
        <Button asChild variant="outline" className="border-primary-foreground hover:bg-primary-foreground hover:text-primary px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg font-medium transition duration-300 text-sm sm:text-base">
          <Link href="/products?promo=beds">مشاهده تخفیف‌ها</Link>
        </Button>
      </div>
    </section>
  );
};

export default PromotionalBanner;
