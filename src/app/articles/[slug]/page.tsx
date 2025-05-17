
import { mockArticles } from '@/lib/mock-data';
import type { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, CalendarDays, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Simulate fetching an article by slug
async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return mockArticles.find(article => article.slug === slug);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-destructive mb-2">مقاله یافت نشد</h1>
        <p className="text-muted-foreground mb-6">متاسفانه مقاله‌ای با این آدرس پیدا نشد.</p>
        <Link href="/articles" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          بازگشت به لیست مقالات
        </Link>
      </div>
    );
  }

  // Basic markdown-to-HTML (replace with a proper library like 'marked' or 'react-markdown' in a real app)
  const renderContentAsHTML = (content: string) => {
    let htmlContent = content;
    // Headers
    htmlContent = htmlContent.replace(/^## (.*$)/gim, '<h2 class="text-xl sm:text-2xl font-semibold mt-6 mb-3">$1</h2>');
    htmlContent = htmlContent.replace(/^### (.*$)/gim, '<h3 class="text-lg sm:text-xl font-semibold mt-5 mb-2">$1</h3>');
    // Bold
    htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    htmlContent = htmlContent.replace(/__(.*?)__/gim, '<strong>$1</strong>');
    // Italic
    htmlContent = htmlContent.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    htmlContent = htmlContent.replace(/_(.*?)_/gim, '<em>$1</em>');
    // Paragraphs (split by double newlines, then wrap non-empty lines)
    htmlContent = htmlContent.split(/\n\s*\n/).map(paragraph => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol')) return trimmed; // Don't wrap headers or lists
      return trimmed ? `<p class="mb-4 leading-relaxed text-foreground/90">${trimmed}</p>` : '';
    }).join('');
    // Basic Unordered lists (lines starting with * or -)
    htmlContent = htmlContent.replace(/^\* (.*$)/gim, '<li class="ms-5 list-disc">$1</li>');
    htmlContent = htmlContent.replace(/^- (.*$)/gim, '<li class="ms-5 list-disc">$1</li>');
    htmlContent = htmlContent.replace(/(<li.*<\/li>\s*)+/g, '<ul>$&</ul>'); // Wrap LIs in UL

    return { __html: htmlContent };
  };


  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="p-0">
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <Image
              src={article.image}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={article.imageHint || 'article banner'}
              priority // Good for LCP
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            {article.title}
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground mb-4">
            {article.date && (
              <div className="flex items-center">
                <CalendarDays size={14} className="ms-1" />
                <span>{article.date}</span>
              </div>
            )}
            {article.category && (
              <div className="flex items-center">
                <Tag size={14} className="ms-1" />
                <Badge variant="outline" className="text-xs">{article.category}</Badge>
              </div>
            )}
          </div>
          
          <Separator className="my-4 sm:my-6" />

          <article 
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={renderContentAsHTML(article.content)} 
          />

          <Separator className="my-6 sm:my-8" />

          <div className="text-center">
            <Link href="/articles" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              بازگشت به همه مقالات
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
