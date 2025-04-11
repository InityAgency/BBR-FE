import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import ResidenceForm from "@/components/admin/Residences/Forms/ResidenceForm";
export default function ResidencesCreate() {
  return (
    <AdminLayout>
      <ResidenceForm />
    </AdminLayout>
  );
}
