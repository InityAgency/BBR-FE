"use client";

import AdminLayout from "@/app/(admin)/AdminLayout";
import LifestyleForm from "@/components/admin/Lifestyles/Forms/LifestyleForm";

export default function CreateLifestylePage() {
    return (
        <AdminLayout>
            <LifestyleForm />
        </AdminLayout>
    );
}