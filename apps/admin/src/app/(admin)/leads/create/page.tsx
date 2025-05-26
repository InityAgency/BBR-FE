import AdminLayout from "../../AdminLayout";
import LeadForm from "@/components/admin/Leads/Forms/LeadForm";

export default function LeadsCreatePage() {
    return (
        <AdminLayout>
            <LeadForm isEditing={false} />
        </AdminLayout>
    );
}