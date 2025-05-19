"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import AdminLayout from "../../AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditRankingCriteriaModal } from "@/components/admin/Modals/RankingCriteriaModal";
import { DeleteConfirmationModal } from "@/components/admin/Modals/DeleteConfirmationModal";
import { CreateRankingCriteriaModal } from "@/components/admin/Modals/CreateRankingCriteriaModal";
import { RankingCriteriaData } from "@/app/schemas/ranking-criteria";
import { toast } from "sonner";
import { TablePagination } from "@/components/admin/Table/TablePagination";

const ITEMS_PER_PAGE = 12;

async function getRankingCriteria(page: number = 1) {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-criteria?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ranking criteria: ${response.status}`);
    }
    
    const data = await response.json();
    return {
        data: data.data,
        totalItems: data.pagination.total,
        totalPages: data.pagination.totalPages
    };
}

export default function RankingCriteriaPage() {
    const [rankingCriteria, setRankingCriteria] = useState<RankingCriteriaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState<RankingCriteriaData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const { data, totalItems, totalPages } = await getRankingCriteria(currentPage);
                setRankingCriteria(data);
                setTotalItems(totalItems);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error loading ranking criteria:', error);
                toast.error('Failed to load ranking criteria');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage]);

    // Reload data after successful edit
    const handleEditSuccess = async () => {
        try {
            const { data, totalItems, totalPages } = await getRankingCriteria(currentPage);
            setRankingCriteria(data);
            setTotalItems(totalItems);
            setTotalPages(totalPages);
            toast.success('Ranking criteria updated successfully');
        } catch (error) {
            console.error('Error reloading data:', error);
            toast.error('Failed to reload data');
        }
    };

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

    // Open edit modal
    const handleEditClick = (criteria: RankingCriteriaData) => {
        setSelectedCriteria(criteria);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (criteria: RankingCriteriaData) => {
        setSelectedCriteria(criteria);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCriteria) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/${API_VERSION}/ranking-criteria/${selectedCriteria.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete ranking criteria');
            }

            // Remove the deleted item from the state
            setRankingCriteria(prev => prev.filter(item => item.id !== selectedCriteria.id));
            toast.success('Ranking criteria deleted successfully');
        } catch (error) {
            console.error('Error deleting ranking criteria:', error);
            toast.error('Failed to delete ranking criteria');
        } finally {
            setDeleteModalOpen(false);
            setSelectedCriteria(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-between items-center mb-6">
                    <PageHeader title="Ranking Criteria" />
                    <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="flex flex-row gap-2 border px-4 py-2 rounded-md items-start justify-between animate-pulse">
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="h-5 bg-muted rounded-md w-2/3"></div>
                                    <div className="h-4 bg-muted rounded-md w-full"></div>
                                    <div className="h-4 bg-muted rounded-md w-2/3"></div>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <div className="h-8 w-16 bg-muted rounded-md"></div>
                                    <div className="h-8 w-8 bg-muted rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <PageHeader title="Ranking Criteria" />
                <Button onClick={() => setCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ranking Criteria
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                        {rankingCriteria.map((criteria) => (
                            <div key={criteria.id} className="flex flex-row gap-2 border px-4 py-2 rounded-md items-center justify-between">
                                <div className="flex flex-col gap-0">
                                    <h2 className="text-md font-medium w-full">{criteria.name}</h2>
                                    <p className="text-sm text-muted-foreground w-full">
                                        {criteria.description || "No description"}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-2">
                                    {criteria.isDefault ? (
                                        <Badge variant="default" className="text-xs bg-green-900/20 text-green-300 border-green-900/50">
                                            Default
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-xs">
                                            Not Default
                                        </Badge>
                                    )}
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        onClick={() => handleEditClick(criteria)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        
                        {rankingCriteria.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No ranking criteria found.</p>
                            </div>
                        )}
                    </div>
                </div>

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

            {/* Edit Modal */}
            {selectedCriteria && (
                <EditRankingCriteriaModal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    rankingCriteria={selectedCriteria}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Ranking Criteria"
                description={`Are you sure you want to delete "${selectedCriteria?.name}"? This action cannot be undone.`}
            />

            {/* Create Modal */}
            <CreateRankingCriteriaModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={handleEditSuccess}
            />
        </AdminLayout>
    );
}