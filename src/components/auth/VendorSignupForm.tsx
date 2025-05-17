'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"

const vendorSignupSchema = z.object({
  shopName: z.string().min(2, { message: "نام فروشگاه باید حداقل 2 حرف باشد." }),
  email: z.string().email({ message: "ایمیل معتبر وارد کنید." }),
  password: z.string().min(8, { message: "رمز عبور باید حداقل 8 کاراکتر باشد." }),
  confirmPassword: z.string(),
  contactPerson: z.string().min(2, { message: "نام مسئول باید حداقل 2 حرف باشد." }),
  phoneNumber: z.string().regex(/^09[0-9]{9}$/, { message: "شماره موبایل معتبر وارد کنید (مثال: 09123456789)." }),
  shopAddress: z.string().min(10, { message: "آدرس فروشگاه باید حداقل 10 حرف باشد." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند.",
  path: ["confirmPassword"],
});

type VendorSignupFormValues = z.infer<typeof vendorSignupSchema>;

export default function VendorSignupForm() {
  const { toast } = useToast();
  const form = useForm<VendorSignupFormValues>({
    resolver: zodResolver(vendorSignupSchema),
    defaultValues: {
      shopName: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactPerson: '',
      phoneNumber: '',
      shopAddress: '',
    },
  });

  async function onSubmit(values: VendorSignupFormValues) {
    // In a real app, you'd send this to your backend
    console.log(values);
    toast({
      title: "ثبت نام موفقیت آمیز بود!",
      description: `فروشگاه ${values.shopName} خوش آمدید. اطلاعات شما برای بررسی ارسال شد.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="shopName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام فروشگاه</FormLabel>
              <FormControl>
                <Input placeholder="مثال: پت شاپ مرکزی" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ایمیل</FormLabel>
              <FormControl>
                <Input type="email" placeholder="shop@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رمز عبور</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تکرار رمز عبور</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام مسئول</FormLabel>
              <FormControl>
                <Input placeholder="مثال: علی رضایی" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>شماره تماس (موبایل)</FormLabel>
              <FormControl>
                <Input placeholder="09123456789" {...field} dir="ltr" className="text-left" />
              </FormControl>
              <FormDescription>این شماره برای تماس با شما استفاده خواهد شد.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shopAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>آدرس فروشگاه</FormLabel>
              <FormControl>
                <Textarea placeholder="آدرس دقیق فروشگاه خود را وارد کنید." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">ثبت نام</Button>
      </form>
    </Form>
  );
}
