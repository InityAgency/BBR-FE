"use client"
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";


export default function ResidencesPending() {
  return (
    <AdminLayout>
      <PageHeader title="Pending Activations" count={117} />
    </AdminLayout>
  );
}
