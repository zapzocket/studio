'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
// Removed toast from here as CartContext will handle it
// import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  // const { toast } = useToast(); // Toast is now in CartContext

  const handleAddToCartClick = async () => {
    // The addToCart in context is now async and handles toasts
    await addToCart(product);
    // Example of a local toast if needed, but context should handle it:
    // toast({
    //   title: "محصول به سبد خرید اضافه شد",
    //   description: product.name,
    // });
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCartClick}
      disabled={isLoading} // Disable button when cart operations are in progress
    >
      {isLoading ? "در حال افزودن..." : "افزودن به سبد خرید"}
    </Button>
  );
};

export default AddToCartButton;
