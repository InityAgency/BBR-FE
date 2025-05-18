"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "../../../AdminLayout";
import LeadForm from "@/components/admin/Leads/Forms/LeadForm";
import { Lead } from "@/app/types/models/Lead";
import { LeadFormData } from "@/app/schemas/lead";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadApiResponse {
  data: Lead;
  statusCode: number;
  message: string;
}

export default function LeadEditPage() {
    const params = useParams();
    const leadId = params.id as string;
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${API_BASE_URL}/api/${API_VERSION}/leads/${leadId}`,
                    {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch lead: ${response.status}`);
                }

                const data: LeadApiResponse = await response.json();
                setLead(data.data);
            } catch (error) {
                console.error('Error fetching lead:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch lead');
                toast.error('Failed to load lead');
            } finally {
                setLoading(false);
            }
        };

        if (leadId) {
            fetchLead();
        }
    }, [leadId]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-64 bg-secondary/50" />
                            <Skeleton className="h-8 w-24 bg-secondary/50" />
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                            <Skeleton className="h-8 w-24 bg-secondary/50" />
                            <Skeleton className="h-8 w-24 bg-secondary/50" />
                        </div>
                    </div>
                    <div className="max-w-2xl">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24 bg-secondary/50" />
                                        <Skeleton className="h-10 w-full bg-secondary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24 bg-secondary/50" />
                                        <Skeleton className="h-10 w-full bg-secondary/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16 bg-secondary/50" />
                                    <Skeleton className="h-10 w-full bg-secondary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32 bg-secondary/50" />
                                    <Skeleton className="h-10 w-full bg-secondary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48 bg-secondary/50" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Skeleton className="h-4 w-4 bg-secondary/50" />
                                            <Skeleton className="h-4 w-20 bg-secondary/50" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Skeleton className="h-4 w-4 bg-secondary/50" />
                                            <Skeleton className="h-4 w-20 bg-secondary/50" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Skeleton className="h-4 w-4 bg-secondary/50" />
                                            <Skeleton className="h-4 w-20 bg-secondary/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-semibold text-destructive mb-2">Error</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </AdminLayout>
        );
    }

    if (!lead) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <h1 className="text-2xl font-semibold mb-2">Lead not found</h1>
                    <p className="text-muted-foreground">The requested lead could not be found.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <LeadForm 
                initialData={{
                    id: lead.id,
                    firstName: lead.firstName,
                    lastName: lead.lastName,
                    email: lead.email,
                    phone: lead.phone,
                    preferredContactMethod: lead.preferredContactMethod,
                    createdAt: lead.createdAt,
                    updatedAt: lead.updatedAt
                }}
                isEditing={true}
            />
        </AdminLayout>
    );
}