import React from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { UsersTable } from "@/components/admin/Users/Table/UsersTable";
import AdminLayout from "../AdminLayout";

export default function UserManagementPage() {
  return (
    <AdminLayout>
      <PageHeader 
        title="User Management"
        buttonText="Add New User"
        buttonUrl="/user-management/create"
      />
      <UsersTable />
    </AdminLayout>
  );
}
