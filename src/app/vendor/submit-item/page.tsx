import ItemSubmissionForm from '@/components/vendor/ItemSubmissionForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SubmitItemPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold">ثبت کالای جدید</CardTitle>
          <CardDescription>
            اطلاعات کالای خود را برای فروش در حیوان کالا وارد کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemSubmissionForm />
        </CardContent>
      </Card>
    </div>
  );
}
