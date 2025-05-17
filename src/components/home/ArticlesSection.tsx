
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticleSummaryCard from '@/components/shared/ArticleSummaryCard';
import { mockArticles } from '@/lib/mock-data'; // Import mockArticles
import type { Article } from '@/types';

// Use the first article from mockArticles as the latest article for the homepage
const latestArticle: Article | undefined = mockArticles.length > 0 ? mockArticles[0] : undefined;

const ArticlesSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center sm:text-right">مقالات جدید</h2>
          <Link href="/articles" className="text-primary hover:text-primary/80 font-medium flex items-center text-sm sm:text-base self-center sm:self-auto">
            مشاهده همه مقالات <ArrowLeft size={18} className="me-2" />
          </Link>
        </div>
        
        {latestArticle ? (
          <ArticleSummaryCard article={latestArticle} />
        ) : (
          <p className="text-center text-muted-foreground">مقاله‌ای برای نمایش وجود ندارد.</p>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
