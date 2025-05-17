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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"

const itemSubmissionSchema = z.object({
  itemName: z.string().min(3, { message: "نام کالا باید حداقل 3 حرف باشد." }),
  description: z.string().min(10, { message: "توضیحات کالا باید حداقل 10 حرف باشد." }),
  price: z.coerce.number().positive({ message: "قیمت باید یک عدد مثبت باشد." }),
  category: z.string({ required_error: "انتخاب دسته‌بندی الزامی است." }),
  // image: z.any().optional(), // Handle file uploads more robustly in a real app
});

type ItemSubmissionFormValues = z.infer<typeof itemSubmissionSchema>;

const categories = [
  { id: 'dog', name: 'سگ' },
  { id: 'cat', name: 'گربه' },
  { id: 'bird', name: 'پرندگان' },
  { id: 'rodent', name: 'جوندگان' },
  { id: 'fish', name: 'ماهی' },
  { id: 'other', name: 'سایر' },
];

export default function ItemSubmissionForm() {
  const { toast } = useToast();
  const form = useForm<ItemSubmissionFormValues>({
    resolver: zodResolver(itemSubmissionSchema),
    defaultValues: {
      itemName: '',
      description: '',
      price: 0,
    },
  });

  async function onSubmit(values: ItemSubmissionFormValues) {
    // In a real app, you'd send this to your backend, including image data
    console.log(values);
    toast({
      title: "کالا با موفقیت ثبت شد!",
      description: `کالای "${values.itemName}" برای فروش قرار گرفت.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام کالا</FormLabel>
              <FormControl>
                <Input placeholder="مثال: غذای خشک گربه بالغ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات کالا</FormLabel>
              <FormControl>
                <Textarea placeholder="جزئیات کامل کالا، مواد تشکیل دهنده، ویژگی‌ها و..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>قیمت (تومان)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="250000" {...field} dir="ltr" className="text-left" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>دسته‌بندی</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="یک دسته‌بندی انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>تصویر کالا</FormLabel>
          <FormControl>
            <Input type="file" accept="image/*" />
          </FormControl>
          <FormDescription>یک تصویر واضح از کالا بارگذاری کنید.</FormDescription>
          <FormMessage />
        </FormItem>
        <Button type="submit" className="w-full">ثبت کالا</Button>
      </form>
    </Form>
  );
}
