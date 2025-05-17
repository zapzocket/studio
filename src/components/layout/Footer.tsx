'use client';

import Link from 'next/link';
import { PawPrint, Instagram, SendHorizonal, Twitter, Send, Phone, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react'; // Import React for React.FormEvent

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      alert('عضویت شما در خبرنامه با موفقیت انجام شد!');
      emailInput.value = '';
    }
  };

  return (
    <footer className="bg-slate-800 text-slate-300 py-12"> {/* Using slate for dark footer as in original */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold mb-4 flex items-center text-white">
              <PawPrint className="me-2 text-primary" /> حیوان کالا
            </Link>
            <p className="text-slate-400 mb-4">
              ارائه کننده بهترین محصولات و خدمات برای حیوانات خانگی شما با بیش از 10 سال سابقه درخشان
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-slate-400 hover:text-white" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white" aria-label="Telegram">
                <SendHorizonal size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">خرید بر اساس حیوان</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=dog" className="text-slate-400 hover:text-white">لوازم سگ</Link></li>
              <li><Link href="/products?category=cat" className="text-slate-400 hover:text-white">لوازم گربه</Link></li>
              <li><Link href="/products?category=bird" className="text-slate-400 hover:text-white">لوازم پرندگان</Link></li>
              <li><Link href="/products?category=rodent" className="text-slate-400 hover:text-white">لوازم جوندگان</Link></li>
              <li><Link href="/products?category=fish" className="text-slate-400 hover:text-white">لوازم ماهی</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">مقالات و راهنما</h3>
            <ul className="space-y-2">
              <li><Link href="/articles?topic=feeding" className="text-slate-400 hover:text-white">تغذیه حیوانات</Link></li>
              <li><Link href="/articles?topic=training" className="text-slate-400 hover:text-white">تربیت حیوانات</Link></li>
              <li><Link href="/articles?topic=health" className="text-slate-400 hover:text-white">بهداشت و سلامت</Link></li>
              <li><Link href="/articles?topic=behavior" className="text-slate-400 hover:text-white">رفتارشناسی</Link></li>
              <li><Link href="/articles" className="text-slate-400 hover:text-white">مقالات جدید</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">عضویت در خبرنامه</h3>
            <p className="text-slate-400 mb-4">
              با عضویت در خبرنامه از جدیدترین محصولات و تخفیف‌ها مطلع شوید
            </p>
            <form className="flex" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-grow px-4 py-2 rounded-s-lg focus:outline-none text-gray-800"
                aria-label="ایمیل برای خبرنامه"
              />
              <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-e-lg rounded-s-none">
                <Send size={18} />
              </Button>
            </form>
            
            <h3 className="text-lg font-bold mt-6 mb-4 text-white">اطلاعات تماس</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center">
                <Phone size={16} className="ms-2" /> 021-12345678
              </li>
              <li className="flex items-center">
                <Mail size={16} className="ms-2" /> info@heyvankala.com
              </li>
              <li className="flex items-center">
                <MapPin size={16} className="ms-2" /> تهران، خیابان آزادی، پلاک 123
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>© {new Date().getFullYear()} حیوان کالا. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
