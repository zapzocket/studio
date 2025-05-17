
import TestimonialCard from '@/components/shared/TestimonialCard';
import type { Testimonial } from '@/types';

// Mock data for testimonials
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'نازنین محمدی',
    avatar: 'https://placehold.co/48x48.png',
    avatarHint: 'woman face',
    rating: 5,
    quote: 'خرید از حیوان کالا واقعا رضایت بخش بود. محصولات با کیفیت و بسته‌بندی عالی داشتند. مخصوصا اسباب‌بازی‌هایی که برای گربه‌ام خریدم خیلی دوست داشت.',
  },
  {
    id: '2',
    name: 'امیر حسینی',
    avatar: 'https://placehold.co/48x48.png',
    avatarHint: 'man face',
    rating: 4.5,
    quote: 'به عنوان کسی که 3 سگ دارم، همیشه دنبال محصولات با کیفیت هستم. حیوان کالا تنوع خوبی از محصولات رو ارائه میده و قیمت‌هاش هم مناسب‌تر از خیلی جاهای دیگه‌ست.',
  },
  {
    id: '3',
    name: 'مریم رضایی',
    avatar: 'https://placehold.co/48x48.png',
    avatarHint: 'woman face glasses',
    rating: 5,
    quote: 'مقالات آموزشی سایت خیلی به من کمک کرد تا بتونم بهتر از طوطی‌ام مراقبت کنم. مشاوره‌های رایگانشون هم واقعا ارزشمند بود. ممنون از تیم پشتیبانی خوبشون.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">نظرات مشتریان</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
