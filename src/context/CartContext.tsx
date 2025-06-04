
'use client';

import type { Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Define the structure of a cart item from the backend
interface BackendCartItem {
  product_id: number;
  itemName: string;
  price: number;
  quantity: number;
  // Optional: include category or image if backend sends them with the cart
  // category?: string;
  // image?: string;
}

// Frontend CartItem now needs to align with what we decide to store after fetching/mapping
// It should still include all necessary fields for display (like image from original Product type)
export interface CartItem {
  id: string; // product_id from backend, converted to string
  name: string; // itemName from backend
  price: number; // price from backend (already a number)
  quantity: number; // quantity from backend
  image: string; // Will need to be sourced, perhaps from original product data if kept, or placeholder
  imageHint?: string;
  category?: string;
  description?: string; // Not typically in cart summary but part of Product
}


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>; // Product here is the full product detail
  removeFromCart: (productId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  getCartItemCount: () => number;
  clearCart: () => Promise<void>;
  calculateTotal: () => number;
  isLoading: boolean; // To indicate background activity
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// No longer need parsePrice if backend sends numbers
// const parsePrice = (priceString: string): number => {
//   return parseInt(priceString.replace(/,/g, ''), 10) || 0;
// };

// Helper to map backend cart item to frontend CartItem
// This is crucial. We need to decide what a "CartItem" on the frontend truly means.
// Does it merge original product details (like image) with cart-specific details (quantity)?
// For now, let's assume the backend cart sends product_id, itemName, price, quantity.
// We'll need to fetch the full product details separately if we need other info like image, or store it initially.
// The current backend /api/cart returns: {"product_id": ..., "itemName": ..., "price": ..., "quantity": ...}

const mapBackendItemToFrontend = (backendItem: BackendCartItem): CartItem => {
  return {
    id: String(backendItem.product_id),
    name: backendItem.itemName,
    price: backendItem.price,
    quantity: backendItem.quantity,
    // These need to be sourced if not available from backend cart endpoint
    image: `https://placehold.co/100x100.png?text=${encodeURIComponent(backendItem.itemName)}`, // Placeholder
    imageHint: backendItem.itemName,
    // category: backendItem.category, // If available
  };
};


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch initial cart state from backend
  useEffect(() => {
    const fetchInitialCart = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data: BackendCartItem[] = await response.json();
        setCartItems(data.map(mapBackendItemToFrontend));
      } catch (error) {
        console.error("Error fetching initial cart:", error);
        toast({ title: "خطا", description: "خطا در دریافت اطلاعات سبد خرید", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialCart();
  }, [toast]); // Added toast to dependencies

  const addToCart = async (product: Product, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: parseInt(product.id), quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
      }
      const updatedCart: BackendCartItem[] = await response.json().then(res => res.cart); // Backend returns { message, cart }
      setCartItems(updatedCart.map(mapBackendItemToFrontend));
      toast({ title: "موفق", description: `${product.name} به سبد خرید اضافه شد.` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error adding to cart:", error);
      toast({ title: "خطا", description: `خطا در افزودن کالا: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/items/${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }
      const updatedCart: BackendCartItem[] = await response.json().then(res => res.cart);
      setCartItems(updatedCart.map(mapBackendItemToFrontend));
      toast({ title: "موفق", description: "کالا از سبد خرید حذف شد." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error removing from cart:", error);
      toast({ title: "خطا", description: `خطا در حذف کالا: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (quantity < 0) return; // Or handle as removal if quantity is 0, backend handles 0 as removal
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item quantity');
      }
      const updatedCart: BackendCartItem[] = await response.json().then(res => res.cart);
      setCartItems(updatedCart.map(mapBackendItemToFrontend));
      toast({ title: "موفق", description: "تعداد کالا در سبد خرید بروزرسانی شد." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating quantity:", error);
      toast({ title: "خطا", description: `خطا در بروزرسانی تعداد: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clear cart');
      }
      setCartItems([]); // Expect empty cart from backend or just clear locally
      toast({ title: "موفق", description: "سبد خرید خالی شد." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error clearing cart:", error);
      toast({ title: "خطا", description: `خطا در خالی کردن سبد: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, getCartItemCount, clearCart, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
