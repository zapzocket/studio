
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

// Product type as used in most places (e.g. ProductCard props)
export interface Product {
  id: string;
  name: string;
  image: string;
  imageHint?: string;
  price: string; // Price is often a string like "120,000" in initial data
  description?: string;
  category?: string;
  rating?: number; // Overall product rating
  comments?: Comment[];
  shop?: Shop;
  isFavorite?: boolean;
}

// CartItem type - used specifically within the cart context and cart page.
// Extends Product but ensures price is a number for calculations.
export interface CartItem extends Omit<Product, 'price'> {
  price: number; // Numeric price for calculations
  quantity: number;
}


export interface Article {
  id: string;
  title: string;
  image: string;
  imageHint?: string;
  summary: string;
  slug: string; // for linking to a full article page
  content: string; // Full content of the article
  category?: string; // Optional: e.g., 'dog', 'cat', 'health'
  date?: string; // Optional: publishing date
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
