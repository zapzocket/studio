
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { recommendVendors, type RecommendVendorsOutput } from '@/ai/flows/recommend-vendors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  // State for AI recommendations
  const [recommendations, setRecommendations] = useState<RecommendVendorsOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // State for product search
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [productSearchError, setProductSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      // Fetch AI Vendor Recommendations
      const fetchRecommendations = async () => {
        setIsAiLoading(true);
        setAiError(null);
        setRecommendations(null);
        try {
          const result = await recommendVendors({ searchQuery: query });
          setRecommendations(result);
        } catch (e) {
          console.error("Error fetching vendor recommendations:", e);
          setAiError("متاسفانه در دریافت پیشنهاد فروشندگان خطایی رخ داد.");
        } finally {
          setIsAiLoading(false);
        }
      };

      // Fetch Searched Products
      const fetchProducts = async () => {
        setIsProductLoading(true);
        setProductSearchError(null);
        setSearchedProducts([]);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch search results: ${response.statusText}`);
          }
          const data = await response.json();
          const mappedProducts: Product[] = data.map((p: any) => ({
            id: String(p.product_id),
            name: p.itemName,
            price: String(p.price),
            category: p.category,
            description: p.description,
            image: `https://placehold.co/300x200.png?text=${encodeURIComponent(p.itemName)}`,
            imageHint: p.itemName,
            isFavorite: false,
          }));
          setSearchedProducts(mappedProducts);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
          console.error("Error fetching search results:", e);
          setProductSearchError(errorMessage);
          toast({
            title: "خطا در جستجوی محصولات",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setIsProductLoading(false);
        }
      };

      fetchRecommendations();
      fetchProducts();
    }
  }, [query]);

  if (!query) {
    return (
      <Alert>
        <AlertTitle>موردی برای جستجو وارد نشده!</AlertTitle>
        <AlertDescription>لطفا عبارت مورد نظر خود را در نوار جستجو وارد کنید.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">نتایج جستجو برای: "{query}"</h1>
      
      {/* AI Vendor Recommendations Section */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4 text-foreground">فروشندگان پیشنهادی</h2>
      {isAiLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ms-3 text-md text-muted-foreground">در حال یافتن بهترین فروشندگان...</p>
        </div>
      )}
      {aiError && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>خطا در پیشنهاد فروشنده</AlertTitle>
          <AlertDescription>{aiError}</AlertDescription>
        </Alert>
      )}
      {recommendations && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">فروشندگان پیشنهادی بر اساس جستجوی شما:</CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.vendorRecommendations && recommendations.vendorRecommendations.length > 0 ? (
              <ul className="list-disc ps-5 space-y-1">
                {recommendations.vendorRecommendations.map((vendorName, index) => (
                  <li key={index} className="text-sm sm:text-base text-foreground">{vendorName}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">فروشنده پیشنهادی برای این عبارت یافت نشد.</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Product Search Results Section */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4 text-foreground">محصولات یافت‌شده</h2>
      {isProductLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ms-3 text-lg text-muted-foreground">در حال جستجوی محصولات...</p>
        </div>
      )}
      {productSearchError && (
        <Alert variant="destructive" className="my-6">
          <AlertTitle>خطا در جستجوی محصول</AlertTitle>
          <AlertDescription>{productSearchError}</AlertDescription>
        </Alert>
      )}
      {!isProductLoading && !productSearchError && searchedProducts.length === 0 && (
         <p className="text-center text-muted-foreground text-lg py-10">
            محصولی برای عبارت "{query}" یافت نشد.
        </p>
      )}
      {searchedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchedProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => {
              // This should be handled by ProductCard or a global cart context
              // For now, we can show a toast or log
              toast({ title: "افزودن به سبد خرید", description: `محصول ${product.name} باید به سبد اضافه شود.`});
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
