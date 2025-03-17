import AdminLayout from "../../../AdminLayout";
import BrandForm from "@/components/admin/Brands/Forms/BrandForm";
import { notFound } from "next/navigation";
import { brandsData } from "@/app/data/brands";

interface BrandEditPageProps {
  params: {
    id: string;
  };
}

export default function BrandEditPage({ params }: BrandEditPageProps) {
  const brand = brandsData.find((b) => b.id === params.id);

  if (!brand) {
    notFound();
  }

  return (
    <AdminLayout>
      <BrandForm initialData={brand} isEditing={true} />
    </AdminLayout>
  );
} 