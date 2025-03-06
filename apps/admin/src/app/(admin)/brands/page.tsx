import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";

export default function BrandsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Brands" count={10} buttonText="Add new brand" buttonUrl="/brands/create"/>
    </AdminLayout>
  );
}
