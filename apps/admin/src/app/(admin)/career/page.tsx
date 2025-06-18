import AdminLayout from "../AdminLayout";
import { CareerTab } from "@/components/admin/Career/CareerTab";

export default function Career() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Career Applications</h1>
        </div>
        
        <CareerTab />
      </div>
    </AdminLayout>
  );
} 