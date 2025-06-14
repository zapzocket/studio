
import type { Product, Comment } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/shared/StarRating';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Store } from 'lucide-react';
// Button import might be removed if AddToCartButton is the only one
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton'; // Import the new client component
import CommentForm from '@/components/shared/CommentForm'; // Import the new form
import { Badge } from "@/components/ui/badge";

interface ProductPageParams {
  id: string;
}

// Helper function to get product
async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, { cache: 'no-store' }); // Use absolute URL for server-side fetch, disable cache
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    const p = await response.json();
    // Map backend data to frontend Product type
    return {
      id: String(p.product_id),
      name: p.itemName,
      price: String(p.price), // Ensure price is string
      category: p.category,
      description: p.description,
      // These fields are not in the backend model, so provide defaults or leave undefined
      image: `https://placehold.co/600x400.png?text=${encodeURIComponent(p.itemName)}`, // Placeholder image
      imageHint: p.itemName,
      isFavorite: false, // Default value
      // Mocked or default values for fields not yet in backend model
      shop: { id: 's1', name: 'فروشگاه پیش فرض' }, // Mock shop
      rating: 0, // Default
      comments: [], // Default
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    // In a real app, you might want to throw the error to be caught by Next.js error handling
    return undefined;
  }
}

const categoryTranslations: { [key: string]: string } = {
  dog: 'سگ',
  cat: 'گربه',
  bird: 'پرندگان',
  rodent: 'جوندگان',
  fish: 'ماهی',
  other: 'سایر',
};

export default async function ProductPage({ params }: { params: ProductPageParams }) {
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-destructive mb-2">کالا یافت نشد</h1>
        <p className="text-muted-foreground mb-6">متاسفانه کالایی با این شناسه پیدا نشد.</p>
        <Button asChild>
          <Link href="/products">بازگشت به لیست محصولات</Link>
        </Button>
      </div>
    );
  }

  const translatedCategory = product.category ? categoryTranslations[product.category] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="relative w-full aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="contain" // Use contain to see the whole image
              data-ai-hint={product.imageHint || 'product image'}
              className="bg-card"
            />
          </div>
        </Card>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">{product.name}</CardTitle>
              {translatedCategory && (
                <Badge variant="outline" className="mt-2 w-fit text-sm">
                  {translatedCategory}
                </Badge>
              )}
              {/* Shop data is currently mocked in getProductById, update if backend provides it */}
              {product.shop && (
                <div className="flex items-center text-sm text-muted-foreground pt-2">
                  <Store size={16} className="ms-2" />
                  <span>فروشنده: {product.shop.name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* Rating and comments are currently mocked in getProductById, update if backend provides them */}
              {product.rating && product.rating > 0 && (
                <div className="mb-4 flex items-center gap-2">
                  <StarRating rating={product.rating} size={20} />
                  <span className="text-sm text-muted-foreground">({product.comments?.length || 0} نظر)</span>
                </div>
              )}
              <p className="text-2xl md:text-3xl font-semibold text-primary mb-4">{product.price} تومان</p>
              {product.description && (
                <p className="text-foreground leading-relaxed text-sm sm:text-base">{product.description}</p>
              )}
            </CardContent>
            <CardFooter>
              <AddToCartButton product={product} />
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Comments Section - Stays as is with mock data for now */}
      {product.comments && product.comments.length > 0 && (
        <Card className="mt-8 md:mt-12">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">نظرات کاربران ({product.comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {product.comments.map((comment: Comment) => (
              <div key={comment.id} className="pb-6 border-b last:border-b-0">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={comment.avatar} alt={comment.user} data-ai-hint={comment.avatarHint || "user avatar"}/>
                    <AvatarFallback>{comment.user.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <p className="font-semibold text-foreground text-sm sm:text-base">{comment.user}</p>
                      <span className="text-xs text-muted-foreground mt-1 sm:mt-0">{comment.date}</span>
                    </div>
                    {comment.rating > 0 && <StarRating rating={comment.rating} size={16} className="mt-1 mb-2" />}
                    <p className="text-xs sm:text-sm text-foreground leading-normal">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Comment Section */}
      <Card className="mt-8 md:mt-12">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">نظر خود را ثبت کنید</CardTitle>
          <CardDescription>تجربه خود را در مورد این کالا با دیگران به اشتراک بگذارید.</CardDescription>
        </CardHeader>
        <CardContent>
          <CommentForm productId={product.id} />
        </CardContent>
      </Card>
    </div>
  );
}
