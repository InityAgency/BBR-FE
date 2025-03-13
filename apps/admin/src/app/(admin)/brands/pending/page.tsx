"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";


export default function BrandsPending() {
  return (
    <AdminLayout>
      <PageHeader title="Pending Activations" count={117} />
    </AdminLayout>
  );
}
