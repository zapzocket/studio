import PartnerProductList from '@/components/products/PartnerProductList';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">محصولات فروشندگان همکار</h1>
      <PartnerProductList />
    </div>
  );
}
