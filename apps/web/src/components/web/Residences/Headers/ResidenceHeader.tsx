"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Calendar, DollarSign, Eye, Pencil, Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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

interface ResidenceHeaderProps {
  residence: any;
}

const getDevelopmentStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "INACTIVE":
      return "bg-red-900/20 text-red-300 border-red-900/50 px-3 py-1.5 text-sm";
    case "DELETED":
      return "bg-red-900/20 text-red-300 border-red-900/50 px-3 py-1.5 text-sm";
    case "PENDING":
      return "bg-yellow-900/20 text-yellow-300 border-yellow-900/50 px-3 py-1.5 text-sm";
    case "ACTIVE":
      return "bg-green-900/20 text-green-300 border-green-900/50 px-3 py-1.5 text-sm";
    default:
      return "bg-gray-800/20 text-gray-300 border-gray-600/50 px-3 py-1.5 text-sm";
  }
};

const getMediaUrl = (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/api/v1/media/${id}/content`;

export function ResidenceHeader({ residence }: ResidenceHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/residences/${residence.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete residence');
      }

      toast.success('Residence deleted successfully');
      router.push('/developer/residences');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete residence');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Hero Section with Featured Image */}
      {/* {residence.featuredImage && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
          <img
            src={getMediaUrl(residence.featuredImage.id)}
            alt={residence.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
       */}

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold sm:text-2xl text-sans">{residence.name}</h1>
            <Badge className={getDevelopmentStatusBadgeStyle(residence.status)}>
              {residence.status?.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-2">
          <Button variant="destructive" className="px-3 py-2" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline" className="px-3 py-2" onClick={() => router.push(`/developer/residences/${residence.slug}/edit`)}>
            <Pencil className="h-4 w-4" />
            Edit Residence
          </Button>
          <Button variant="outline" className="px-3 py-2" onClick={() => router.push(`/residences/${residence.slug}`)} rel="noopener noreferrer">
            <Eye className="h-4 w-4" />
            View Residence
          </Button>
        </div>

        {/* <div className="lg:text-right">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-end">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">
                {residence.budgetStartRange && residence.budgetEndRange ? 
                  `${residence.budgetStartRange} - ${residence.budgetEndRange} ${residence.country?.currencyCode || ""}`.trim() : 
                  "Price on request"
                }
              </span>
            </div>
            
            {residence.yearBuilt && (
              <div className="flex items-center gap-2 justify-end">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Built in {residence.yearBuilt}</span>
              </div>
            )}
            
            {residence.brand?.name && (
              <div className="flex items-center gap-2 justify-end">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>by {residence.brand.name}</span>
              </div>
            )}
          </div>
        </div> */}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-medium text-sans">Are you sure you want to delete this residence?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the residence
              and all associated data.
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
    </div>
  );
}