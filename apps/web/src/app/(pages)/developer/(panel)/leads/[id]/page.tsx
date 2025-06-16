"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Mail, Phone, Eye, ExternalLink, Building2, Home } from "lucide-react";
import Link from "next/link";
import { Lead } from "@/types/lead";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

const getStatusBadgeStyle = (status: string) => {
    switch (status) {
        case "NEW":
            return "bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50 text-sm";
        case "WON":
            return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50 text-sm";
        case "LOST":
            return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50 text-sm";
        case "CANCELLED":
            return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50 text-sm";
        default:
            return "";
    }
};

const formatStatus = (status: string): string => {
    if (!status) return "";
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const formatContactMethod = (method: string | string[] | null): string => {
    if (!method) return "-";

    if (Array.isArray(method)) {
        return method
            .map(m => m.split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' '))
            .join(', ');
    }

    return method
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const formatRequestType = (type: string): string => {
    return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
};

interface EntityInfo {
    id: string;
    name: string;
    type: 'residence' | 'unit';
    slug: string;
}

export default function LeadDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const leadId = params.id as string;
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [entityInfo, setEntityInfo] = useState<Record<string, EntityInfo>>({});

    useEffect(() => {
        const fetchLead = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/leads/${leadId}`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch lead");
                const data = await res.json();
                setLead(data.data);

                // Fetch entity information for each request
                if (data.data.requests) {
                    const entityPromises = data.data.requests.map(async (request: any) => {
                        try {
                            // Try fetching as residence first
                            const residenceRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/public/residences/${request.entityId}`);
                            if (residenceRes.ok) {
                                const residenceData = await residenceRes.json();
                                return {
                                    id: request.entityId,
                                    info: {
                                        id: request.entityId,
                                        name: residenceData.data.name,
                                        type: 'residence' as const,
                                        slug: residenceData.data.slug,
                                    }
                                };
                            }

                            // If residence fails, try fetching as unit
                            const unitRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/public/units/${request.entityId}`);
                            if (unitRes.ok) {
                                const unitData = await unitRes.json();
                                return {
                                    id: request.entityId,
                                    info: {
                                        id: request.entityId,
                                        name: unitData.data.name,
                                        type: 'unit' as const,
                                        slug: unitData.data.slug,
                                    }
                                };
                            }
                        } catch (error) {
                            console.error(`Failed to fetch entity info for ${request.entityId}`);
                        }
                        return null;
                    });

                    const entityResults = await Promise.all(entityPromises);
                    const entityMap = entityResults.reduce((acc: Record<string, EntityInfo>, curr) => {
                        if (curr) {
                            acc[curr.id] = curr.info;
                        }
                        return acc;
                    }, {});
                    setEntityInfo(entityMap);
                }
            } catch (e) {
                toast.error("Failed to load lead");
                router.push("/404");
            } finally {
                setLoading(false);
            }
        };
        if (leadId) fetchLead();
    }, [leadId, router]);

    const handleDelete = async () => {
        if (!lead) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/leads/${lead.id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete lead");
            toast.success("Lead deleted successfully!");
            router.push("/leads");
        } catch (e) {
            toast.error("Failed to delete lead");
        }
    };

    console.log(lead);

    if (loading) {
        return (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
        );
    }

    if (!lead) {
        return (
            <div className="p-8 text-center text-destructive">Lead not found.</div>
        );
    }

    return (
        <div className="py-8">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-sans">
                        {lead.firstName} {lead.lastName}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {/* <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="cursor-pointer transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button> */}
                </div>
            </div>


            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sans">Are you sure you want to delete this lead?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the lead and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-white hover:bg-destructive/80"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

                <div className="bg-secondary rounded-lg p-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 text-sans">Contact information</h2>
                    <div className="mb-2 flex w-full gap-4">
                        <div className="w-1/2">
                            <div className="text-xs text-muted-foreground">First Name</div>
                            <div className="font-medium">{lead.firstName || "-"}</div>
                        </div>
                        <div className="w-1/2">
                            <div className="text-xs text-muted-foreground">Last Name</div>
                            <div className="font-medium">{lead.lastName || "-"}</div>
                        </div>
                    </div>
                    <div className="mb-2 flex w-full gap-4">
                        <div className="w-1/2">
                            <div className="text-xs text-muted-foreground">Email</div>
                            <div className="font-medium flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email || "-"}</a>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="text-xs text-muted-foreground">Phone</div>
                            <div className="font-medium flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                {lead.phone ? (
                                    <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="text-xs text-muted-foreground">Preferred Contact Method</div>
                        <div className="font-medium mt-2">
                            {lead.preferredContactMethod ? (
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(lead.preferredContactMethod) ? (
                                        lead.preferredContactMethod.map((method, index) => (
                                            <Badge key={index} variant="outline" className="text-sm px-2 py-1 inline-block">
                                                {formatContactMethod(method) || "-"}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge variant="secondary" className="text-sm px-2 py-0.5 inline-block">
                                            {formatContactMethod(lead.preferredContactMethod) || "-"}
                                        </Badge>
                                    )}
                                </div>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-lg p-4 lg:col-span-3">
                    <h2 className="text-lg font-semibold text-sans mb-4">Requests</h2>
                    {lead.requests && Array.isArray(lead.requests) && lead.requests.length > 0 ? (
                        <div className="divide-y divide-border">
                            {lead.requests.map((request) => (
                                <div key={request.id} className="py-4 mb-2 flex items-center justify-between border p-4 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-sm px-2 py-0.5 inline-block capitalize">
                                                {request.type ? formatRequestType(request.type) : "-"}
                                            </Badge>

                                            {entityInfo[request.entityId] && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                     <Badge variant="outline" className="text-sm px-2 py-0.5">
                                                        {entityInfo[request.entityId].type === 'residence' ? 'Residence' : 'Unit'}
                                                    </Badge>
                                                    {entityInfo[request.entityId].type === 'residence' ? (
                                                        <Building2 className="h-4 w-4" />
                                                    ) : (
                                                        <Home className="h-4 w-4" />
                                                    )}
                                                    <span>{entityInfo[request.entityId].name}</span>
                                                   
                                                    <Link
                                                        href={
                                                            entityInfo[request.entityId].type === 'unit'
                                                                ? `/exclusive-deals/${entityInfo[request.entityId].slug}`
                                                                : `/residences/${entityInfo[request.entityId].slug}`
                                                        }
                                                        className="text-sm text-primary hover:text-primary/80 transition-all"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                        {request.subject && (
                                            <span className="font-medium">{request.subject}</span>
                                        )}

                                        <div className="text-sm text-muted-foreground mb-2">
                                            {request.message}
                                        </div>

                                    </div>
                                    {/* <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => router.push(`/leads/requests/${request.id}`)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            -
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}