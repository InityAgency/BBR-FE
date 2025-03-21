"use client"

import { useSearchParams } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { residencesData } from "@/app/data/residences";
import { ResidencesTable } from "@/components/admin/Residences/Table/ResidencesTable";

export default function ResidencesPage() {
  const searchParams = useSearchParams();
  
  // Ukupan broj rezidencija
  const totalCount = residencesData.length;
  
  return (
    <AdminLayout>
      <PageHeader 
        title="Residences" 
        count={totalCount} 
        buttonText="Add new residence" 
        buttonUrl="/residences/create" 
      />

      <ResidencesTable initialStatusFilter={searchParams.get("status")} />
    </AdminLayout>
  );
}