
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { recommendVendors, type RecommendVendorsOutput } from '@/ai/flows/recommend-vendors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [recommendations, setRecommendations] = useState<RecommendVendorsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations(null);
        try {
          const result = await recommendVendors({ searchQuery: query });
          setRecommendations(result);
        } catch (e) {
          console.error("Error fetching vendor recommendations:", e);
          setError("متاسفانه در دریافت پیشنهاد فروشندگان خطایی رخ داد.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecommendations();
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
      
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
          <p className="ms-3 text-md sm:text-lg text-muted-foreground">در حال یافتن بهترین فروشندگان...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="my-6">
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">فروشندگان پیشنهادی بر اساس جستجوی شما:</CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.vendorRecommendations && recommendations.vendorRecommendations.length > 0 ? (
              <ul className="list-disc ps-5 space-y-2">
                {recommendations.vendorRecommendations.map((vendorName, index) => (
                  <li key={index} className="text-base sm:text-lg text-foreground">{vendorName}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">فروشنده پیشنهادی برای این عبارت یافت نشد.</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Placeholder for actual product search results */}
      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">محصولات مرتبط (نمایشی)</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          در این بخش لیست محصولات مرتبط با جستجوی شما نمایش داده خواهد شد. 
          این قابلیت در حال حاضر پیاده‌سازی نشده است.
        </p>
        {/* TODO: Implement actual product search and display ProductCard components here */}
      </div>
    </div>
  );
}
