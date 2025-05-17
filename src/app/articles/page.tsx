
import ArticleSummaryCard from '@/components/shared/ArticleSummaryCard';
import { mockArticles } from '@/lib/mock-data';
import type { Article } from '@/types';
import Link from 'next/link';

export default function ArticlesPage() {
  const articles: Article[] = mockArticles;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <header className="mb-8 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          مقالات حیوان کالا
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          جدیدترین مطالب و راهنماهای مراقبت از حیوانات خانگی
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <ArticleSummaryCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">
            در حال حاضر مقاله‌ای برای نمایش وجود ندارد.
          </p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      )}
    </div>
  );
}
