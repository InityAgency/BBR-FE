import AdminLayout from "../../../AdminLayout";
import ResidenceForm from "@/components/admin/Residences/Forms/ResidenceForm";

export default function ResidencesEdit() {
  return (
    <AdminLayout>
      <ResidenceForm isEditing={true} />
    </AdminLayout>
  );
}