import AdminLayout from "../../../AdminLayout";
import BrandForm from "@/components/admin/Brands/Forms/BrandForm";
import { notFound } from "next/navigation";
import { brandsData } from "@/app/data/brands";

interface BrandEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function BrandEditPage({ params }: BrandEditPageProps) {
  const resolvedParams = await params;
  const brand = brandsData.find((b) => b.id === resolvedParams.id);

  if (!brand) {
    notFound();
  }

  return (
    <AdminLayout>
      <BrandForm initialData={brand} isEditing={true} />
    </AdminLayout>
  );
} 