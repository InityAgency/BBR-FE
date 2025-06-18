"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ExternalLink, User, Calendar, Mail, FileText } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { TablePagination } from "@/components/admin/Table/TablePagination";

interface ContactForm {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    link?: string;
    description: string;
    attachment?: {
        id: string;
        originalFileName: string;
        mimeType: string;
        uploadStatus: string;
        size: number;
    };
    type: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    data: ContactForm[];
    statusCode: number;
    message: string;
    pagination: {
        total: number;
        totalPages: number;
        page: number;
        limit: number;
    };
    timestamp: string;
    path: string;
}

const ITEMS_PER_PAGE = 12;

export function FeaturesTab() {
    const [features, setFeatures] = useState<ContactForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFeatures = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/contact-forms?type=SUGGEST_FEATURE&page=${page}&limit=${ITEMS_PER_PAGE}`,
                {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();
            setFeatures(data.data);
            setTotalItems(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
        } catch (err: any) {
            console.error("Error fetching features:", err);
            setError(err.message || "Failed to fetch features");
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (mediaId: string, fileName: string) => {
        try {
            setDownloadingFiles(prev => new Set(prev).add(mediaId));
            
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/media/${mediaId}/content`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status}`);
            }

            // Get the blob from the response
            const blob = await response.blob();
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success(`File "${fileName}" downloaded successfully`);
        } catch (err: any) {
            console.error("Error downloading file:", err);
            toast.error(`Failed to download file: ${err.message}`);
        } finally {
            setDownloadingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(mediaId);
                return newSet;
            });
        }
    };

    useEffect(() => {
        fetchFeatures(currentPage);
    }, [currentPage]);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredFeatures = features.filter(feature => {
        const matchesSearch = feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             feature.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             feature.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             feature.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-destructive mb-2">Error loading features</p>
                    <Button onClick={() => fetchFeatures(currentPage)} variant="outline">Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Features List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredFeatures.length === 0 ? (
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No features found</p>
                                <p className="text-sm">No feature requests match your search criteria.</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    filteredFeatures.map((feature) => (
                        <div key={feature.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border rounded-lg py-4">
                            <div className="px-6">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col items-start justify-between gap-3 mb-2 w-full lg:items-center">
                                            <h3 className="text-lg font-semibold text-foreground w-full">
                                                {feature.firstName} {feature.lastName}
                                            </h3>
                                            <div className="flex items-start  flex-col lg:flex-col gap-2 border-b border-t pt-4 pb-4 w-full ">
                                                <Badge variant="secondary" className="text-sm">
                                                    {feature.type.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {feature.id}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="font-medium">Email:</span>
                                        <span>{feature.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-medium">Submitted:</span>
                                        <span>{formatDate(feature.createdAt)}</span>
                                    </div>

                                    {feature.link && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <ExternalLink className="h-4 w-4" />
                                            <span className="font-medium">Link:</span>
                                            <a
                                                href={feature.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline truncate"
                                            >
                                                {feature.link}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Attachment */}
                                {feature.attachment && (
                                    <div className="bg-secondary/40 border rounded-lg p-3">
                                        <div className="flex flex-col gap-3 items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{feature.attachment.originalFileName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({formatFileSize(feature.attachment.size)})
                                                </span>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="w-full"
                                                size="sm"
                                                onClick={() => downloadFile(feature.attachment!.id, feature.attachment!.originalFileName)}
                                                disabled={downloadingFiles.has(feature.attachment!.id)}
                                            >
                                                {downloadingFiles.has(feature.attachment!.id) ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-1"></div>
                                                        Downloading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                loading={loading}
            />
        </div>
    );
} 