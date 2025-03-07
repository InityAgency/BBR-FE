import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";

import { ResidencesTable } from "@/components/admin/Residences/ResidencesTable";

export default function ResidencesPage() {
  return (
    <AdminLayout>
      <PageHeader 
        title="Residences" 
        count={117} 
        buttonText="Add new residence" 
        buttonUrl="/residences/create" 
      />

      <ResidencesTable />
    </AdminLayout>
  );
}