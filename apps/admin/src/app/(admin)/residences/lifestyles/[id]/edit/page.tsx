"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "@/app/(admin)/AdminLayout";
import LifestyleForm from "@/components/admin/Lifestyles/Forms/LifestyleForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Lifestyle } from "@/app/types/models/Lifestyles";

interface PageParams {
    id: string;
}

export default function LifestyleEditPage({ 
    params 
}: { 
    params: Promise<PageParams>
}) {
    const router = useRouter();
    const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = React.use(params);

    useEffect(() => {
        const fetchLifestyle = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/lifestyles/${id}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch lifestyle: ${response.status}`);
                }

                const data = await response.json();
                if (data.data) {
                    setLifestyle(data.data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching lifestyle:", error);
                setError((error as Error).message || "Failed to load lifestyle details");
                toast.error("Failed to load lifestyle details");
            } finally {
                setLoading(false);
            }
        };

        fetchLifestyle();
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="w-full space-y-6">
                    <Skeleton className="h-10 w-64 bg-muted/20" />
                    <Skeleton className="h-10 w-32 bg-muted/20" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-32 bg-muted/20" />
                        <Skeleton className="h-10 w-full bg-muted/20" />
                        <Skeleton className="h-24 w-full bg-muted/20" />
                        <Skeleton className="h-10 w-full bg-muted/20" />
                        <Skeleton className="h-24 w-full bg-muted/20" />
                        <Skeleton className="h-10 w-full bg-muted/20" />
                        <Skeleton className="h-24 w-full bg-muted/20" />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !lifestyle) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-64">
                    <h1 className="text-xl font-semibold mb-2">Lifestyle not found</h1>
                    <p className="text-muted-foreground mb-4">{error || "The requested lifestyle could not be found."}</p>
                    <button 
                        className="text-primary hover:underline"
                        onClick={() => router.push("/residences/lifestyles")}
                    >
                        Back to Lifestyles
                    </button>
                </div>
            </AdminLayout>
        );
    }

    // Transform API data to match the form format
    const transformedData = {
        id: lifestyle.id,
        name: lifestyle.name
    };

    return (
        <AdminLayout>
            <LifestyleForm initialData={transformedData} isEditing={true} />
        </AdminLayout>
    );
}
    

