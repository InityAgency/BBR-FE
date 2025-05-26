"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "@/app/(admin)/AdminLayout";
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
import { Trash2, Mail, Phone, Eye, ExternalLink } from "lucide-react";
import { Lead } from "@/app/types/models/Lead";
import { User } from "@/app/types/models/User";
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

export default function LeadDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const leadId = params.id as string;
    const [lead, setLead] = useState<Lead | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [status, setStatus] = useState<string>("");

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
                setStatus(data.data.status);

                // Fetch user data if lead exists
                if (data.data.email) {
                    const userRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/users/by-email?email=${data.data.email}`, {
                        credentials: "include",
                    });
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setUser(userData.data);
                    }
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

    const handleStatusChange = async (newStatus: string) => {
        if (!lead) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/leads/${lead.id}/status`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error("Failed to update status");
            setStatus(newStatus);
            toast.success(`Status updated to ${formatStatus(newStatus)}`);
            setLead({ ...lead, status: newStatus });
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

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
            <AdminLayout>
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
            </AdminLayout>
        );
    }

    if (!lead) {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-destructive">Lead not found.</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold">
                        {lead.firstName} {lead.lastName}
                    </h1>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
                            <Badge className={`${getStatusBadgeStyle(status)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}>
                                {formatStatus(status)}
                            </Badge>
                        </SelectTrigger>
                        <SelectContent>
                            {["NEW", "WON", "LOST"].map((s) => (
                                <SelectItem key={s} value={s} className="text-sm">
                                    {formatStatus(s)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/leads/${lead.id}/edit`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="cursor-pointer transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* DIALOG ZA BRISANJE */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this lead?</AlertDialogTitle>
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

            {/* DETALJI LEADA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact info */}
                <div className="bg-card rounded-lg p-6 border border-border">
                    <h2 className="text-lg font-semibold mb-4">Contact information</h2>
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
                                            <Badge key={index} variant="secondary" className="text-sm px-2 py-0.5 inline-block">
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

                {/* Lead info */}
                <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center mb-4 justify-between">
                        <h2 className="text-lg font-semibold mr-2">User Account Preferences</h2>
                        {user && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 p-0"
                                onClick={() => router.push(`/user-management/${user.id}`)}
                                title="View user details"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                    {user ? (
                        <>
                            <div className="mb-2 flex w-full gap-4">
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Full Name</div>
                                    <div className="font-medium text-sm">{user.fullName || "-"}</div>
                                </div>
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Registered on</div>
                                    <div className="font-medium text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</div>
                                </div>

                            </div>
                            <div className="mb-2 flex w-full gap-4">
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Email Verified</div>
                                    <div className="font-medium text-sm">{user.emailVerified !== undefined ? (user.emailVerified ? 'Yes' : 'No') : "-"}</div>
                                </div>
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Role</div>
                                    <div className="font-medium text-sm capitalize">{user.role?.name || "-"}</div>
                                </div>
                            </div>
                            <div className="mb-2 flex w-full gap-4">
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Company Name</div>
                                    <div className="font-medium text-sm">
                                        {user.company && typeof user.company !== 'string' ? user.company.name : "-"}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Company Address</div>
                                    <div className="font-medium text-sm">
                                        {user.company && typeof user.company !== 'string' ? user.company.address : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 flex w-full gap-4">
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Company Phone</div>
                                    <div className="font-medium text-sm">
                                        {user.company && typeof user.company !== 'string' ? user.company.phoneNumber : "-"}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Company Website</div>
                                    <div className="font-medium text-sm">
                                        {user.company && typeof user.company !== 'string' && user.company.website ? (
                                            <a href={user.company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {user.company.website}
                                            </a>
                                        ) : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 flex w-full gap-4">
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Contact Person</div>
                                    <div className="font-medium text-sm">
                                        {user.company && typeof user.company !== 'string' ? user.company.contactPersonFullName : "-"}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="text-xs text-muted-foreground">Contact Email</div>
                                    <div className="font-medium text-sm">
                                        {user.company && typeof user.company !== 'string' && user.company.contactPersonEmail ? (
                                            <a href={`mailto:${user.company.contactPersonEmail}`} className="hover:underline">
                                                {user.company.contactPersonEmail}
                                            </a>
                                        ) : "-"}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-left py-4 text-muted-foreground bg-white/5 border w-full rounded-lg p-4">
                            This lead is not registered as a user on the platform.
                        </div>
                    )}
                </div>

                {/* Requests */}
                <div className="bg-card rounded-lg p-6 border border-border lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Requests</h2>
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/leads/requests/create?leadId=${lead.id}`)}
                        >
                            Create request
                        </Button> */}
                    </div>

                    {lead.requests && Array.isArray(lead.requests) && lead.requests.length > 0 ? (
                        <div className="divide-y divide-border">
                            {lead.requests.map((request) => (
                                <div key={request.id} className="py-4 mb-2 flex items-center justify-between border p-4 rounded-lg hover:bg-white/5 transition-colors">
                                    <div>
                                        {request.subject ? (
                                            <div className="font-medium">{request.subject}</div>
                                        ) : (
                                            <div className="font-medium">-</div>
                                        )}
                                        {request.message ? (
                                            <p className="text-sm text-muted-foreground">
                                                {request.message}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">-</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-sm px-2 py-0.5 inline-block capitalize">
                                            {request.type ? formatRequestType(request.type) : "-"}
                                        </Badge>
                                        <Badge className={getStatusBadgeStyle(request.status)}>
                                            {request.status ? formatStatus(request.status) : "-"}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => router.push(`/leads/requests/${request.id}`)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
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
        </AdminLayout>
    );
}