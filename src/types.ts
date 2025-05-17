import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  image: string;
  imageHint?: string;
  price: string;
  isFavorite?: boolean;
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
