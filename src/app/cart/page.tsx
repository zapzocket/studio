
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  imageHint?: string;
  price: number; // Use number for calculations
  quantity: number;
  category?: string;
}

const initialCartItems: CartItem[] = [
  { id: '1', name: 'غذای خشک سگ پرمیوم رویال کنین', image: 'https://placehold.co/100x100.png', imageHint: 'dog food bag', price: 320000, quantity: 1, category: 'dog' },
  { id: '2', name: 'اسباب بازی گربه با پر و زنگوله', image: 'https://placehold.co/100x100.png', imageHint: 'cat toy feather', price: 85000, quantity: 2, category: 'cat' },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    // Add toast notification if desired
  };

  const calculateSubtotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);
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
            <Button size="lg" className="w-full sm:w-auto">
              ادامه فرایند خرید و پرداخت
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
