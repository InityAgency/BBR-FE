"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye,  Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RankingCriteriaScore {
  name: string;
  score: number;
  description: string;
}

interface Residence {
  id: string;
  name: string;
  position: number;
  totalScore: number;
  featuredImageId: string;
  company: {
    contactPersonFullName: string;
    contactPersonEmail: string;
    contactPersonPhoneNumber: string;
  };
  rankingCriteriaScores: RankingCriteriaScore[];
  address: string;
  budgetStartRange: string;
  budgetEndRange: string;
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface ResidencesTabProps {
  categoryId: string;
  refreshKey?: number;
}

// Memoizovan TableSkeleton za bolju performansu
const TableSkeleton = React.memo(() => {
  return (
    <div className="w-full border rounded-md">
      {/* Skelet za header tabele */}
      <div className="border-b px-4 py-3 flex items-center">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-[300px] rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 flex-1 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-[50px] rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Skelet za redove tabele */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
          <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
          <div className="flex items-center gap-3 w-[300px]">
            <Skeleton className="h-12 w-16 rounded-md bg-muted/20" />
            <Skeleton className="h-6 flex-1 rounded-md bg-muted/20" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32 rounded-md bg-muted/20" />
            <Skeleton className="h-4 w-40 rounded-md bg-muted/20" />
            <Skeleton className="h-4 w-36 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md mx-auto bg-muted/20" />
          <Skeleton className="h-8 w-8 rounded-md ml-2 bg-muted/20" />
        </div>
      ))}
    </div>
  );
});

export default function ResidencesTab({ categoryId, refreshKey }: ResidencesTabProps) {
  const [data, setData] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10
  });

  const fetchResidences = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${categoryId}/residences?page=${page}&limit=12`,
        { credentials: "include", cache: "no-store" }
      );
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json.data);
      setPagination(json.pagination);
    } catch {
      toast.error("Failed to load residences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [refreshKey, categoryId]);

  useEffect(() => {
    fetchResidences(currentPage);
  }, [categoryId, currentPage, refreshKey]);

  const goToNextPage = () => {
    if (currentPage < pagination.totalPages) {
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

  const handleRemoveResidence = async (residenceId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residence-scores/${residenceId}/category/${categoryId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove residence from category');
      }

      toast.success('Residence successfully removed from category');
      fetchResidences(currentPage);
    } catch (error) {
      toast.error('Failed to remove residence from category');
    }
  };

  if (loading) return <TableSkeleton />;
  if (!data.length) return <p className="text-sm text-muted-foreground">No residences found</p>;

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[300px]">Residence</TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead className="text-center w-1/6">Total Score</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(residence => (
              <TableRow key={residence.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{residence.position}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-md overflow-hidden border">
                      {residence.featuredImageId ? (
                        <Image 
                          src={`${API_BASE_URL}/api/${API_VERSION}/media/${residence.featuredImageId}/content`} 
                          alt={residence.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-md overflow-hidden border bg-muted/20 flex items-center justify-center">
                          {residence.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{residence.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{residence.company?.contactPersonFullName}</p>
                    <Link href={`mailto:${residence.company?.contactPersonEmail}`} className="text-sm text-muted-foreground text-primary transition-colors">{residence.company?.contactPersonEmail}</Link>
                    <Link href={`tel:${residence.company?.contactPersonPhoneNumber}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{residence.company?.contactPersonPhoneNumber}</Link>
                  </div>
                </TableCell>          
                <TableCell className="text-center w-1/6">
                  <Badge variant="default" className="text-md font-medium w-8 h-8">
                    {residence.totalScore}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/residences/${residence.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-400 bg-red-900/30 hover:bg-red-700/30 transition-colors">
                          <Trash2 className="h-4 w-4" />  
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will remove the residence from this ranking category. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveResidence(residence.id)}
                            className="bg-destructive text-white hover:bg-destructive/80 transition-colors"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-8 h-8"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
