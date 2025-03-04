"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (isLoggedIn) {
      router.push("/dashboard"); 
    } else {
      router.push("/auth/login"); 
    }
  }, [router]);

  return null; 
}
