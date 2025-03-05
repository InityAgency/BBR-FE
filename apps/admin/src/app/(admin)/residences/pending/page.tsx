"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import AdminLayout from "../../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";


export default function ResidencesPending() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <AdminLayout>
      <PageHeader title="Pending Activations" count={117} />
    </AdminLayout>
  );
}
