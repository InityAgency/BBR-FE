"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "../../../AdminLayout";
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
import { Trash2 } from "lucide-react";
import { Request } from "@/app/types/models/Request";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case "NEW":
      return "bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50";
    case "IN_PROGRESS":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "COMPLETED":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "CANCELLED":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
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

const formatTypeName = (name: string): string => {
  if (!name) return "";
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function RequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/requests/${requestId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch request");
        const data = await res.json();
        setRequest(data.data);
        setStatus(data.data.status);
      } catch (e) {
        toast.error("Failed to load request");
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };
    if (requestId) fetchRequest();
  }, [requestId, router]);

  console.log(request);

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/requests/${request.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStatus(newStatus);
      toast.success(`Status updated to ${formatStatus(newStatus)}`);
      setRequest({ ...request, status: newStatus });
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!request) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/requests/${request.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete request");
      toast.success("Request deleted successfully!");
      router.push("/leads/requests");
    } catch (e) {
      toast.error("Failed to delete request");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-destructive">Request not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">
            Request for {formatTypeName(request.type)}
          </h1>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
              <Badge className={`${getStatusBadgeStyle(status)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}>
                {formatStatus(status)}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
                <SelectItem key={s} value={s} className="text-sm">
                  {formatStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="cursor-pointer transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* DIALOG ZA BRISANJE */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the request and all associated data.
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

      {/* DETALJI REQUESTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead info */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Lead information</h2>
          <div className="mb-2 flex gap-4">
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">First Name</div>
              <div className="font-medium">{request.lead?.firstName}</div>
            </div>
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Last Name</div>
              <div className="font-medium">{request.lead?.lastName}</div>
            </div>
          </div>
          <div className="mb-2 flex gap-4">
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Email address</div>
              <div className="font-medium">{request.lead?.email}</div>
            </div>
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Phone number</div>
              <div className="font-medium">{request.lead?.phone || '-'}</div>
            </div>
          </div>
          <div className="mb-2 flex gap-4">
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Preferred contact method</div>
              <div className="font-medium flex flex-wrap gap-2">
                {Array.isArray(request.lead?.preferredContactMethod) && request.lead.preferredContactMethod.length > 0
                  ? request.lead.preferredContactMethod.map((m: string) => (
                      <Badge key={m} variant="secondary" className="text-xs px-2 py-0.5">
                        {formatTypeName(m)}
                      </Badge>
                    ))
                  : (typeof request.lead?.preferredContactMethod === 'string' ? formatTypeName(request.lead.preferredContactMethod) : '-')}
              </div>
            </div>
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-medium">{request.lead?.status ? formatStatus(request.lead.status) : '-'}</div>
            </div>
          </div>
        </div>
        {/* Request info */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Request information</h2>
          <div className="mb-2 flex gap-4">
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Request ID</div>
              <div className="font-medium">{request.id}</div>
            </div>
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Request Type</div>
              <div className="font-medium">{formatTypeName(request.type)}</div>
            </div>
          </div>
          <div className="mb-2 flex gap-4">
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Created date</div>
              <div className="font-medium">{request.createdAt ? new Date(request.createdAt).toLocaleString() : '-'}</div>
            </div>
            <div className="w-1/2">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-medium">{formatStatus(request.status)}</div>
            </div>
          </div>
        </div>
        {/* Request details */}
        <div className="bg-card rounded-lg p-6 border border-border lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Request Details</h2>
          <div className="mb-2">
            <div className="text-xs text-muted-foreground">Subject</div>
            <div className="font-medium">{request.subject || '-'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Message</div>
            <div className="font-medium whitespace-pre-line">{request.message || '-'}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}