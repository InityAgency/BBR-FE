"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { ClaimRequest } from "@/app/types/models/ClaimRequest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Globe, Building, Calendar, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ClaimRequestHeader } from "@/components/admin/ClaimRequests/Headers/ClaimRequestHeader";

export default function ClaimRequestSingle() {
    const params = useParams();
    const router = useRouter();
    const requestId = params.id as string;
    const [request, setRequest] = useState<ClaimRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchRequest = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/claim-profile-contact-forms/${requestId}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error("Failed to fetch claim request");
            const data = await res.json();
            setRequest(data.data);
        } catch (e) {
            setError("Failed to load claim request");
            toast.error("Failed to load claim request");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (status: string) => {
        setIsProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/claim-profile-contact-forms/${requestId}/status`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error();
            toast.success(`Request ${status.toLowerCase()} successfully`);
            await fetchRequest();
        } catch {
            toast.error("Failed to update status");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/claim-profile-contact-forms/${requestId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            toast.success("Request deleted successfully");
            router.push('/residences/claim-requests');
        } catch {
            toast.error("Failed to delete request");
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!request?.cv?.id) return toast.error('No file available for download');
        try {
            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/media/${request.cv.id}/content`, { 
                credentials: 'include' 
            });
            if (!response.ok) throw new Error();
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = request.cv.originalFileName || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('File downloaded successfully');
        } catch {
            toast.error('Failed to download file');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            NEW: { label: "New", className: "bg-blue-900/50 text-blue-300 border-blue-700/50" },
            ACCEPTED: { label: "Accepted", className: "bg-green-900/50 text-green-300 border-green-700/50" },
            REJECTED: { label: "Rejected", className: "bg-red-900/50 text-red-300 border-red-700/50" }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

        return (
            <Badge variant="outline" className={config.className}>
                {config.label}
            </Badge>
        );
    };

    useEffect(() => {
        if (requestId) fetchRequest();
    }, [requestId]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !request) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p className="text-muted-foreground">{error || "Request not found"}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ClaimRequestHeader 
                request={request}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isProcessing={isProcessing}
            />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Applicant Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Applicant Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{request.firstName} {request.lastName}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{request.email}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{request.phoneCode.code} {request.phoneNumber}</p>
                                <p className="text-xs text-muted-foreground">{request.phoneCode.country.name}</p>
                            </div>
                        </div>
                        
                        {request.websiteUrl && (
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Website</p>
                                    <a 
                                        href={request.websiteUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        {request.websiteUrl}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Request Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Request Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Request ID</p>
                            <p className="font-mono text-sm">{request.id}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <div className="mt-1">
                                {getStatusBadge(request.status)}
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Submitted</p>
                            <p className="font-medium">{new Date(request.createdAt).toLocaleString()}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="font-medium">{new Date(request.updatedAt).toLocaleString()}</p>
                        </div>

                        {request.createdBy && (
                            <div>
                                <p className="text-sm text-muted-foreground">Created By</p>
                                <p className="font-medium">{request.createdBy.fullName}</p>
                                <p className="text-xs text-muted-foreground">{request.createdBy.email}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Residence Information */}
                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Residence Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {request.residence ? (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">Residence Name</p>
                                    <p className="font-medium">{request.residence.name}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Address</p>
                                    <p className="font-medium">{request.residence.address}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant="outline" className="bg-green-900/50 text-green-300 border-green-700/50">
                                        {request.residence.status}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Development Status</p>
                                    <p className="font-medium">{request.residence.developmentStatus}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Budget Range</p>
                                    <p className="font-medium">
                                        ${parseInt(request.residence.budgetStartRange).toLocaleString()} - ${parseInt(request.residence.budgetEndRange).toLocaleString()}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No residence assigned</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* CV/Files Information */}
                <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Uploaded Files
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {request.cv ? (
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                <div>
                                    <p className="font-medium">{request.cv.originalFileName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {request.cv.mimeType} • {(request.cv.size / 1024).toFixed(1)} KB • {request.cv.uploadStatus}
                                    </p>
                                </div>
                                <Button onClick={handleDownload} size="sm" variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No files uploaded</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}