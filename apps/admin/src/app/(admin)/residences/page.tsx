import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";

export default function ResidencesPage() {
  return (
    <AdminLayout>
      <PageHeader 
        title="Residences" 
        count={117} 
        buttonText="Add new residence" 
        buttonUrl="/residences/create" 
      />

    </AdminLayout>
  );
}