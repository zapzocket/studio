import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Article } from '@/types';

interface ArticleSummaryCardProps {
  article: Article;
}

const ArticleSummaryCard: React.FC<ArticleSummaryCardProps> = ({ article }) => {
  return (
    <Card className="article-card rounded-xl overflow-hidden shadow-sm border-border transition duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-64 md:h-auto relative">
          <Image 
            src={article.image} 
            alt={article.title} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={article.imageHint || "pet care"}
          />
        </div>
        <CardContent className="md:w-2/3 p-6">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">{article.title}</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {article.summary}
          </p>
          <Link href={`/articles/${article.slug}`} className="text-primary hover:text-primary/80 font-medium flex items-center">
            بیشتر بخوانید <ArrowLeft size={18} className="me-2" />
          </Link>
        </CardContent>
      </div>
    </Card>
  );
};

export default ArticleSummaryCard;
