
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void; // Optional: if cart logic is managed higher up
}

const categoryTranslations: { [key: string]: string } = {
  dog: 'سگ',
  cat: 'گربه',
  bird: 'پرندگان',
  rodent: 'جوندگان',
  fish: 'ماهی',
  other: 'سایر',
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const { toast } = useToast();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد",
      description: product.name,
    });
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: product.name,
    });
  };

  const translatedCategory = product.category ? categoryTranslations[product.category] : null;

  return (
    <Card className="product-card rounded-xl overflow-hidden shadow-sm border-border transition duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative w-full h-40 sm:h-48">
          <Image 
            src={product.image} 
            alt={product.name} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={product.imageHint || "pet product"}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 start-2 sm:top-3 sm:start-3 text-muted-foreground hover:text-destructive bg-card/70 hover:bg-card p-1 h-8 w-8 sm:h-auto sm:w-auto"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          >
            <Heart size={18} fill={isFavorite ? 'hsl(var(--destructive))' : 'none'} className={isFavorite ? 'text-destructive' : ''} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        {translatedCategory && (
          <Badge variant="outline" className="mb-2 text-xs">
            {translatedCategory}
          </Badge>
        )}
        <CardTitle className="text-sm sm:text-base font-bold mb-1 sm:mb-2 leading-tight">
          <Link href={`/products/${product.id}`} className="hover:text-primary">{product.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:items-center">
        <span className="font-bold text-primary text-sm sm:text-base md:text-lg">{product.price} تومان</span>
        <Button 
          variant="outline" 
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition duration-300 w-full sm:w-auto text-xs sm:text-sm"
          onClick={handleAddToCartClick}
        >
          افزودن به سبد
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
