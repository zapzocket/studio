
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PawPrint, Search, LayoutGrid, Heart, ShoppingCart, User, Menu as MenuIcon, LogOut, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0); // Placeholder for cart count
  const router = useRouter();
  const { toast } = useToast();

  // Effect to load cart item count from local storage or an API in a real app
  useEffect(() => {
    // For demo, let's initialize with a value. In a real app, this might come from context/state management.
    setCartItemCount(2);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // This function would be passed to product cards to update cart count
  // For now, it's just a placeholder to demonstrate capability
  const handleAddToCart = () => {
    setCartItemCount(prevCount => prevCount + 1);
    // Could add animation logic here as in original script if desired
  };

  const handleSignOut = () => {
    // In a real app, you would handle sign-out logic here (e.g., clear session, API call)
    toast({
      title: "خروج از حساب",
      description: "شما با موفقیت از حساب کاربری خود خارج شدید.",
    });
    // Optionally redirect to home or login page
    // router.push('/');
  };


  return (
    <header className="bg-card shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="bg-primary text-primary-foreground p-2 rounded-full me-2">
            <PawPrint size={24} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">حیوان کالا</h1>
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden md:block flex-grow mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="جستجوی کالا یا مقاله ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 ps-4 pe-10 border-border rounded-full focus:ring-primary focus:border-primary"
              aria-label="جستجوی کالا یا مقاله"
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground h-8 w-8">
              <Search size={20} />
            </Button>
          </div>
        </form>

        <div className="flex items-center space-x-4 md:space-x-6 rtl:space-x-reverse">
          <Link href="/categories" className="hidden md:block text-muted-foreground hover:text-primary">
            <LayoutGrid size={24} />
          </Link>
          <Link href="/wishlist" className="text-muted-foreground hover:text-primary">
            <Heart size={24} />
          </Link>
          <Link href="/cart" className="text-muted-foreground hover:text-primary relative">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -end-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                <User size={24} />
                <span className="sr-only">باز کردن منوی کاربر</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حساب کاربری من</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/cart" className="flex items-center">
                  <ShoppingBag className="ms-2 h-4 w-4" />
                  سبد خرید من
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="flex items-center">
                  <Package className="ms-2 h-4 w-4" />
                  سفارشات من
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center">
                <LogOut className="ms-2 h-4 w-4" />
                خروج از حساب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden text-muted-foreground h-8 w-8">
            <MenuIcon size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden container mx-auto px-4 mt-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            type="text"
            placeholder="جستجوی کالا یا مقاله ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 ps-4 pe-10 border-border rounded-full focus:ring-primary focus:border-primary"
            aria-label="جستجوی کالا یا مقاله"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground h-8 w-8">
            <Search size={20} />
          </Button>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t mt-3">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link href="/categories" className="py-2 text-foreground hover:text-primary" onClick={toggleMobileMenu}>دسته‌بندی‌ها</Link>
            <Link href="/products" className="py-2 text-foreground hover:text-primary" onClick={toggleMobileMenu}>محصولات</Link>
            <Link href="/articles" className="py-2 text-foreground hover:text-primary" onClick={toggleMobileMenu}>مقالات</Link>
            <Link href="/about" className="py-2 text-foreground hover:text-primary" onClick={toggleMobileMenu}>درباره ما</Link>
            <Link href="/contact" className="py-2 text-foreground hover:text-primary" onClick={toggleMobileMenu}>تماس با ما</Link>
            <Link href="/auth/vendor-signup" className="py-2 text-accent-foreground hover:text-primary" onClick={toggleMobileMenu}>ثبت نام فروشنده</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
