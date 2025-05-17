import Image from 'next/image';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(testimonial.rating);
    const halfStar = testimonial.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="text-yellow-400" fill="currentColor" />);
    }
    if (halfStar) {
      stars.push(<StarHalf key="half" size={16} className="text-yellow-400" fill="currentColor" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <Card className="testimonial-card p-6 rounded-xl shadow-sm border-border h-full">
      <CardContent className="p-0">
        <div className="flex items-center mb-4">
          <Image 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            width={48} 
            height={48} 
            className="rounded-full object-cover"
            data-ai-hint={testimonial.avatarHint || "person face"}
          />
          <div className="me-3">
            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
            <div className="flex text-sm">{renderStars()}</div>
          </div>
        </div>
        <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
