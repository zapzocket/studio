'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '@/types'; // Assuming Product type can represent listed items

// Mock data
const mockVendorItems: Product[] = [
  { id: 'vitem1', name: 'غذای خشک گربه برند X', price: '150,000', image: 'https://placehold.co/100x100.png', imageHint: 'cat food' },
  { id: 'vitem2', name: 'قلاده ضد کک سگ', price: '80,000', image: 'https://placehold.co/100x100.png', imageHint: 'dog collar' },
];

const mockVendorInfo = {
  shopName: "پت شاپ نمونه",
  email: "vendor@example.com",
  contactPerson: "آقای فروشنده",
  phoneNumber: "09120000000",
  shopAddress: "تهران، خیابان نمونه، پلاک ۱",
};

export default function VendorDashboardClient() {
  const [items, setItems] = useState<Product[]>(mockVendorItems);
  const [vendorInfo, setVendorInfo] = useState(mockVendorInfo);

  const handleItemDelete = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // Add toast notification
  };

  const handleInfoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to update vendor info (e.g., API call)
    // Add toast notification
    alert("اطلاعات فروشگاه به‌روزرسانی شد (نمایشی).")
  };

  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="listings">کالاهای من</TabsTrigger>
        <TabsTrigger value="account">اطلاعات حساب</TabsTrigger>
      </TabsList>
      <TabsContent value="listings">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>لیست کالاهای شما</CardTitle>
                <CardDescription>کالاهای ثبت شده برای فروش را مدیریت کنید.</CardDescription>
              </div>
              <Button asChild variant="default">
                <Link href="/vendor/submit-item"><PlusCircle className="ms-2 h-4 w-4" /> ثبت کالای جدید</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length > 0 ? items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} data-ai-hint={item.imageHint} className="w-16 h-16 rounded object-cover" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.price} تومان</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/vendor/edit-item/${item.id}`}><Edit3 className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleItemDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )) : (
              <p className="text-center text-muted-foreground py-4">هنوز کالایی ثبت نکرده‌اید.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات فروشگاه</CardTitle>
            <CardDescription>اطلاعات تماس و فروشگاه خود را ویرایش کنید.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInfoUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopName">نام فروشگاه</Label>
                  <Input id="shopName" value={vendorInfo.shopName} onChange={e => setVendorInfo({...vendorInfo, shopName: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="email">ایمیل</Label>
                  <Input id="email" type="email" value={vendorInfo.email} disabled className="bg-muted/50"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="contactPerson">نام مسئول</Label>
                  <Input id="contactPerson" value={vendorInfo.contactPerson} onChange={e => setVendorInfo({...vendorInfo, contactPerson: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">شماره تماس</Label>
                  <Input id="phoneNumber" value={vendorInfo.phoneNumber} onChange={e => setVendorInfo({...vendorInfo, phoneNumber: e.target.value})} dir="ltr" className="text-left"/>
                </div>
              </div>
              <div>
                <Label htmlFor="shopAddress">آدرس فروشگاه</Label>
                <Textarea id="shopAddress" value={vendorInfo.shopAddress} onChange={e => setVendorInfo({...vendorInfo, shopAddress: e.target.value})} />
              </div>
              <Button type="submit" className="w-full md:w-auto">به‌روزرسانی اطلاعات</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
