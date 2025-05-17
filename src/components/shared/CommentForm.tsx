
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import StarRating from '@/components/shared/StarRating'; // For display if needed, or for input later
import React from 'react';

const commentFormSchema = z.object({
  userName: z.string().min(2, { message: "نام باید حداقل ۲ حرف باشد." }),
  rating: z.coerce.number().min(1, {message: "امتیاز الزامی است."}).max(5, {message: "امتیاز باید بین ۱ تا ۵ باشد."}),
  text: z.string().min(10, { message: "نظر شما باید حداقل ۱۰ حرف باشد." }),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
  productId: string; // To associate comment with a product
  onCommentSubmit?: (comment: CommentFormValues) => void; // Optional callback
}

export default function CommentForm({ productId, onCommentSubmit }: CommentFormProps) {
  const { toast } = useToast();
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      userName: '',
      rating: 0, // Default to 0, user must select
      text: '',
    },
  });

  async function onSubmit(values: CommentFormValues) {
    console.log({ ...values, productId, date: new Date().toLocaleDateString('fa-IR') });
    toast({
      title: "نظر شما ثبت شد!",
      description: (
        <div className="space-y-1">
          <p>نام: {values.userName}</p>
          <p>امتیاز: {values.rating} ستاره</p>
          <p>نظر: {values.text}</p>
        </div>
      ),
      duration: 5000,
    });
    if (onCommentSubmit) {
      onCommentSubmit(values);
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام شما</FormLabel>
              <FormControl>
                <Input placeholder="نام خود را وارد کنید" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>امتیاز شما</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value === 0 ? '' : field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="یک امتیاز از ۱ تا ۵ انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={String(num)}>
                      <div className="flex items-center">
                        {num} <StarRating rating={num} totalStars={num} size={16} className="me-1" iconClassName="ms-1 text-yellow-400"/>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نظر شما</FormLabel>
              <FormControl>
                <Textarea placeholder="نظر خود را در مورد این کالا بنویسید..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto">ارسال نظر</Button>
      </form>
    </Form>
  );
}
