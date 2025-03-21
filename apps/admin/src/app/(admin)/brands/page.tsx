// app/admin/brands/page.tsx
"use client"

import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { BrandsTable } from "@/components/admin/Brands/Table/BrandsTable";
import { brandsData } from "@/app/data/brands";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BrandsPage() {
  const searchParams = useSearchParams();
  const [pendingCount, setPendingCount] = useState(0);
  
  useEffect(() => {
    // Izračunaj broj brendova sa pending statusom
    const count = brandsData.filter(brand => brand.status === "Pending").length;
    setPendingCount(count);
  }, []);

  return (
    <AdminLayout>
      <PageHeader 
        title="Brand Management" 
        count={brandsData.length} 
        buttonText="Add new brand" 
        buttonUrl="/brands/create" 
      />

      <BrandsTable initialStatusFilter={searchParams.get("status")} />
    </AdminLayout>
  );
}