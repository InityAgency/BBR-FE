"use client";
import UnitForm from "@/components/admin/Residences/Units/UnitForm";
import AdminLayout from "../../../../AdminLayout";
import { useParams } from "next/navigation";

export default function CreateUnitPage() {
  const params = useParams();
  const residenceId = params.id as string; // residenceId iz [id] foldera
  
  return (
    <AdminLayout>
      <UnitForm 
        initialData={{ residenceId }} 
        initialImages={[]}
      />
    </AdminLayout>
  );
}