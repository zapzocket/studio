
import type { LucideIcon } from 'lucide-react';

export interface Shop {
  id: string;
  name: string;
  logo?: string;
  logoHint?: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar?: string;
  avatarHint?: string;
  text: string;
  rating: number; // User's rating for the product in this comment
  date: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  imageHint?: string;
  price: string;
  description?: string;
  category?: string;
  rating?: number; // Overall product rating
  comments?: Comment[];
  shop?: Shop;
  isFavorite?: boolean;
  // Add other relevant fields from existing mock data if needed for consistency
  // For example, if category was used by ProductCard, ensure it's here.
}

export interface Article {
  id: string;
  title: string;
  image: string;
  imageHint?: string;
  summary: string;
  slug: string; // for linking to a full article page
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  avatarHint?: string;
  rating: number; // e.g., 4.5 for 4.5 stars
  quote: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: LucideIcon;
  bgColorClass: string;
  iconColorClass: string;
  href: string;
}

// For AI Vendor Recommendation
export interface VendorRecommendation {
  id: string;
  name: string;
  relevance: number;
}
