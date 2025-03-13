// app/admin/brands/page.tsx
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";

import { BrandsTable } from "@/components/admin/Brands/Table/BrandsTable";

export default function BrandsPage() {
  return (
    <AdminLayout>
      <PageHeader 
        title="Brand Management" 
        count={48} 
        buttonText="Add new brand" 
        buttonUrl="/brands/create" 
      />

      <BrandsTable />
    </AdminLayout>
  );
}