"use client";

import AdminLayout from "@/app/(admin)/AdminLayout";
import AmenityForm from "@/components/admin/Amenities/Forms/AmenityForm";

export default function CreateAmenityPage() {
  return (
    <AdminLayout>
      <AmenityForm />
    </AdminLayout>
  );
}
