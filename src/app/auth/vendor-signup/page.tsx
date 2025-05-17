import VendorSignupForm from '@/components/auth/VendorSignupForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function VendorSignupPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold">ثبت نام به عنوان فروشنده</CardTitle>
          <CardDescription>
            به خانواده حیوان کالا بپیوندید و محصولات خود را به هزاران دوستدار حیوانات خانگی عرضه کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorSignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
