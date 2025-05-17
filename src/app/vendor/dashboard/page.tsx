import VendorDashboardClient from '@/components/vendor/VendorDashboardClient';

export default function VendorDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">داشبورد فروشنده</h1>
      <VendorDashboardClient />
    </div>
  );
}
