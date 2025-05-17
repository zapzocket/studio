
import { Star, StarHalf, StarOff } from 'lucide-react';
import React from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 20,
  className = 'flex items-center',
  iconClassName = 'text-yellow-400',
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  if (rating <= 0) {
    return (
      <div className={className} aria-label={`No rating`}>
        {[...Array(totalStars)].map((_, i) => (
          <StarOff key={`empty-${i}`} size={size} className={cn(iconClassName, 'text-muted-foreground')} />
        ))}
      </div>
    );
  }

  return (
    <div className={className} aria-label={`Rating: ${rating} out of ${totalStars} stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} fill="currentColor" className={iconClassName} />
      ))}
      {halfStar && <StarHalf key="half" size={size} fill="currentColor" className={iconClassName} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className={cn(iconClassName, 'text-muted-foreground/50')} />
      ))}
    </div>
  );
};

// cn utility function (simplified, assuming it's available or define it if not)
// In a real project, this would typically come from a utility file like `@/lib/utils`
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');


export default StarRating;
