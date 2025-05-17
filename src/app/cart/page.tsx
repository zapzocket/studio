
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useCart, type CartItem } from '@/context/CartContext'; // Import useCart and CartItem
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, updateItemQuantity, removeFromCart, calculateTotal, clearCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    removeFromCart(itemId);
    if (itemToRemove) {
      toast({
        title: "کالا از سبد حذف شد",
        description: `${itemToRemove.name} از سبد خرید شما حذف شد.`,
      });
    }
  };

  const calculateSubtotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  const handleCheckout = () => {
    // In a real app, navigate to checkout page or process payment
    toast({
      title: "انتقال به صفحه پرداخت",
      description: "سفارش شما در حال پردازش است...",
    });
    // clearCart(); // Optionally clear cart after checkout starts
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">سبد خرید شما</CardTitle>
          <CardDescription>
            کالاهای موجود در سبد خرید خود را بررسی و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] hidden sm:table-cell">تصویر</TableHead>
                    <TableHead>کالا</TableHead>
                    <TableHead className="text-center">تعداد</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">قیمت واحد</TableHead>
                    <TableHead className="text-center">جمع کل</TableHead>
                    <TableHead className="text-left">حذف</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint={item.imageHint || 'product image'}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
                          {item.name}
                        </Link>
                        {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                            <PlusCircle size={14} />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <MinusCircle size={14} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">{item.price.toLocaleString('fa-IR')} تومان</TableCell>
                      <TableCell className="text-center font-medium">
                        {calculateSubtotal(item).toLocaleString('fa-IR')} تومان
                      </TableCell>
                      <TableCell className="text-left">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleRemoveItem(item.id)}>
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end pt-4 border-t">
                <div className="text-lg sm:text-xl font-semibold">
                  جمع کل سبد خرید: {calculateTotal().toLocaleString('fa-IR')} تومان
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-muted-foreground">سبد خرید شما در حال حاضر خالی است.</p>
              <Button asChild className="mt-6">
                <Link href="/products">مشاهده محصولات</Link>
              </Button>
            </div>
          )}
        </CardContent>
        {cartItems.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
             <Button variant="outline" asChild>
                <Link href="/products">ادامه خرید</Link>
              </Button>
            <Button size="lg" className="w-full sm:w-auto" onClick={handleCheckout}>
              ادامه فرایند خرید و پرداخت
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
