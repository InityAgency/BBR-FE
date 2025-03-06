import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";

export default function UserManagmentPage() {
  return (
    <AdminLayout>
      <PageHeader title="User Management" count={10} buttonText="Add new user" buttonUrl="/user-management/create"/>
    </AdminLayout>
  );
}
