
'use client';

import type { Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem extends Product {
  quantity: number;
  // Ensure price is consistently a number for calculations
  price: number; 
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  getCartItemCount: () => number;
  clearCart: () => void;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to parse string price "120,000" to number 120000
const parsePrice = (priceString: string): number => {
  return parseInt(priceString.replace(/,/g, ''), 10) || 0;
};


const initialCartItemsData: Product[] = [
  // This is initial data for demo if needed, but cart will start empty typically
  // { id: '1', name: 'غذای خشک سگ پرمیوم رویال کنین', image: 'https://placehold.co/100x100.png', imageHint: 'dog food bag', price: "320000", category: 'dog' },
  // { id: '2', name: 'اسباب بازی گربه با پر و زنگوله', image: 'https://placehold.co/100x100.png', imageHint: 'cat toy feather', price: "85000", category: 'cat' },
];


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize cart from localStorage if available
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('heyvanKalaCart');
      if (storedCart) {
        try {
          return JSON.parse(storedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    // Persist cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('heyvanKalaCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      const productPrice = parsePrice(String(product.price)); // Ensure product.price is treated as string

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add all properties from Product, then add quantity and ensure price is number
        const newItem: CartItem = {
          ...product,
          price: productPrice, // Use parsed numeric price
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
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
