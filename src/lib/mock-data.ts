
import type { Product } from '@/types';

export const detailedMockProducts: Product[] = [
  {
    id: '1', // Matches ID in TopProductsSection
    name: 'غذای خشک سگ پرمیوم رویال کنین',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'dog food bag',
    price: '320,000',
    description: 'غذای خشک سگ پرمیوم رویال کنین یک انتخاب عالی برای سگ‌های بالغ با فعالیت متوسط است. این غذا با فرمولاسیون ویژه خود به حفظ سلامت پوست و مو، تقویت سیستم ایمنی و بهبود عملکرد دستگاه گوارش کمک می‌کند. دانه‌های این غذا اندازه‌ای مناسب داشته و به راحتی توسط سگ‌ها خورده می‌شود.',
    category: 'dog',
    rating: 4.7,
    shop: {
      id: 'shop1',
      name: 'پت شاپ مرکزی',
      logo: 'https://placehold.co/100x100.png',
      logoHint: 'pet shop logo',
    },
    comments: [
      {
        id: 'comment1',
        user: 'رضا احمدی',
        avatar: 'https://placehold.co/48x48.png',
        avatarHint: 'man face',
        text: 'سگ من عاشق این غذا شده! کیفیتش واقعا خوبه و تاثیرش رو روی موهاش دیدم.',
        rating: 5,
        date: '۲ روز پیش',
      },
      {
        id: 'comment2',
        user: 'سارا محمدی',
        avatar: 'https://placehold.co/48x48.png',
        avatarHint: 'woman face',
        text: 'بسته‌بندی خوبی داشت و به موقع رسید. ممنون از فروشگاه.',
        rating: 4,
        date: '۵ روز پیش',
      },
    ],
    isFavorite: true,
  },
  {
    id: '2', // Matches ID in TopProductsSection
    name: 'اسباب بازی گربه با پر و زنگوله',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'cat toy feather',
    price: '85,000',
    description: 'این اسباب بازی جذاب با پرهای رنگارنگ و زنگوله‌ی کوچک، ساعت‌ها گربه‌ی شما را سرگرم خواهد کرد. طراحی سبک و مقاوم آن برای بازی‌های پر جنب و جوش گربه‌ها ایده‌آل است. به تحریک غریزه شکار و افزایش فعالیت بدنی گربه کمک می‌کند.',
    category: 'cat',
    rating: 4.2,
    shop: {
      id: 'shop2',
      name: 'دنیای حیوانات',
      logo: 'https://placehold.co/100x100.png',
      logoHint: 'animal world logo',
    },
    comments: [
      {
        id: 'comment3',
        user: 'علی اکبری',
        avatar: 'https://placehold.co/48x48.png',
        avatarHint: 'man smiling',
        text: 'گربه‌ام خیلی باهاش بازی می‌کنه، کیفیت ساختش هم خوبه.',
        rating: 4,
        date: '۱ هفته پیش',
      },
    ],
  },
  {
    id: 'p1', // Matches ID in PartnerProductList
    name: 'قلاده چرمی دست‌دوز سگ',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'leather dog collar',
    price: '180,000',
    description: 'قلاده چرمی دست‌دوز با کیفیت بالا، ساخته شده از چرم طبیعی و یراق‌آلات مقاوم. این قلاده علاوه بر زیبایی، راحتی و دوام فوق‌العاده‌ای را برای سگ شما فراهم می‌کند. موجود در سایزهای مختلف.',
    category: 'dog',
    rating: 4.9,
    shop: {
      id: 'shop3',
      name: 'هنر چرم حیوانات',
      logo: 'https://placehold.co/100x100.png',
      logoHint: 'leather craft logo',
    },
    comments: [
      {
        id: 'comment4',
        user: 'مریم جعفری',
        avatar: 'https://placehold.co/48x48.png',
        avatarHint: 'woman glasses',
        text: 'خیلی شیک و محکمه. دقیقا همونی بود که می‌خواستم.',
        rating: 5,
        date: '۳ روز پیش',
      },
      {
        id: 'comment5',
        user: 'پیمان اسدی',
        avatar: 'https://placehold.co/48x48.png',
        avatarHint: 'man beard',
        text: 'کیفیت چرمش عالیه، به نظر میاد خیلی عمر کنه.',
        rating: 5,
        date: '۱۰ روز پیش',
      },
    ],
    isFavorite: false,
  },
  // Add more products as needed to cover other IDs from product lists
];
