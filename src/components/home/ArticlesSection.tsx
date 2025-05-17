import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticleSummaryCard from '@/components/shared/ArticleSummaryCard';
import type { Article } from '@/types';

// Mock data for articles
const latestArticle: Article = {
  id: '1',
  title: 'راهنمای تغذیه گربه: نکات مهم برای سلامت دوست پشمالوی شما',
  image: 'https://placehold.co/600x400.png',
  imageHint: 'cat eating food',
  summary: 'تغذیه مناسب یکی از مهمترین عوامل در سلامت و طول عمر گربه‌هاست. در این مقاله به بررسی نیازهای غذایی گربه‌ها در سنین مختلف، انواع غذاهای تجاری و خانگی، مقدار مناسب غذا و زمان‌بندی وعده‌های غذایی می‌پردازیم. همچنین نکات مهم درباره غذاهای ممنوعه برای گربه‌ها را بررسی خواهیم کرد...',
  slug: 'cat-feeding-guide',
};

const ArticlesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">مقالات جدید</h2>
          <Link href="/articles" className="text-primary hover:text-primary/80 font-medium flex items-center">
            مشاهده همه مقالات <ArrowLeft size={20} className="me-2" />
          </Link>
        </div>
        
        <ArticleSummaryCard article={latestArticle} />
      </div>
    </section>
  );
};

export default ArticlesSection;
