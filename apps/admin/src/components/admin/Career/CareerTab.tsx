"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ExternalLink, User, Calendar, Mail, FileText, Phone, Briefcase, MoreHorizontal } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { CareerDetailsModal } from "./CareerDetailsModal";

interface CareerForm {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    message: string;
    cv: string | null;
    position: string;
    status: string;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    data: CareerForm[];
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

export function CareerTab() {
    const [careerForms, setCareerForms] = useState<CareerForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchCareerForms = useCallback(async (page: number, search?: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString()
            });
            
            if (search && search.trim()) {
                params.append('query', search.trim());
            }
            
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/career-contact-forms?${params.toString()}`,
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
            setCareerForms(data.data);
            setTotalItems(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
        } catch (err: any) {
            console.error("Error fetching career forms:", err);
            setError(err.message || "Failed to fetch career forms");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchCareerForms(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, fetchCareerForms]);

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

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-900/20 text-blue-300 border-blue-900/50';
            case 'IN REVIEW':
                return 'bg-yellow-900/20 text-yellow-300 border-yellow-900/50';
            case 'ACCEPTED':
                return 'bg-green-900/20 text-green-300 border-green-900/50';
            case 'REJECT':
                return 'bg-red-900/20 text-red-300 border-red-900/50';
            default:
                return 'bg-gray-900/20 text-gray-300 border-gray-900/50';
        }
    };

    const filteredCareerForms = careerForms;

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

    const openModal = (careerId: string) => {
        setSelectedCareerId(careerId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCareerId(null);
    };

    const handleStatusChange = (updatedCareerId: string, newStatus: string) => {
        // Ažuriraj lokalno stanje bez pozivanja API-ja
        setCareerForms(prevForms => 
            prevForms.map(form => 
                form.id === updatedCareerId 
                    ? { ...form, status: newStatus }
                    : form
            )
        );
    };

    const handleDelete = (deletedCareerId: string) => {
        // Ukloni iz lokalnog stanja bez pozivanja API-ja
        setCareerForms(prevForms => 
            prevForms.filter(form => form.id !== deletedCareerId)
        );
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
                    <p className="text-destructive mb-2">Error loading career applications</p>
                    <Button onClick={() => fetchCareerForms(currentPage, debouncedSearchTerm)} variant="outline">Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search by name, email, position, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div> */}

            {/* Career Forms List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCareerForms.length === 0 ? (
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No career applications found</p>
                                <p className="text-sm">No career applications match your search criteria.</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    filteredCareerForms.map((form) => (
                        <div key={form.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border rounded-lg py-4">
                            <div className="px-6">

                                {/* Header */}
                                <div className="flex flex-row items-center justify-between w-full mb-2">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {form.fullName}
                                    </h3>
                                    <div className={`px-3 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeStyle(form.status)}`}>{form.status}</div>
                                </div>
                        

                                {/* Position */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 mt-3">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="font-medium">Position:</span>
                                    <span>{form.position}</span>
                                </div>

                                {/* Message */}
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {form.message}
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 gap-4 mb-4 px-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span className="font-medium">Email:</span>
                                    <span>{form.email}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span className="font-medium">Phone:</span>
                                    <span>{form.phone}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="font-medium">LinkedIn:</span>
                                    <a
                                        href={form.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline truncate"
                                    >
                                        {form.linkedin}
                                    </a>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Applied:</span>
                                    <span>{formatDate(form.createdAt)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between px-6">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openModal(form.id)}
                                    className="flex items-center gap-2 w-full mt-2"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    View Details
                                </Button>

                                {/* CV Download */}
                                {form.cv && (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => downloadFile(form.cv!, `CV_${form.fullName.replace(/\s+/g, '_')}.pdf`)}
                                        disabled={downloadingFiles.has(form.cv!)}
                                    >
                                        {downloadingFiles.has(form.cv!) ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-1"></div>
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4 mr-1" />
                                                Download CV
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {/* Note */}
                            {form.note && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-medium">Note:</span> {form.note}
                                    </p>
                                </div>
                            )}
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

            {/* Details Modal */}
            {isModalOpen && (
                <CareerDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    careerId={selectedCareerId}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
} 