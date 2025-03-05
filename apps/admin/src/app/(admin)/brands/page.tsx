"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";

export default function BrandsPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <AdminLayout>
      <PageHeader title="Brands" count={10} buttonText="Add new brand" buttonUrl="/brands/create"/>
    </AdminLayout>
  );
}
