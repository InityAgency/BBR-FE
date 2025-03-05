"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import AdminLayout from "../AdminLayout";


export default function UserManagmentPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <AdminLayout>
      <h1>Welcome to the User Managment!</h1>
      <p>Only logged-in users can see this page.</p>
    </AdminLayout>
  );
}
