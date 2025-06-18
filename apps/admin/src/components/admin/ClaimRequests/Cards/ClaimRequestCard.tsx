import { ClaimRequest } from "@/app/types/models/ClaimRequest";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Mail, Phone } from "lucide-react";
import { ClaimRequestsActions } from "../Table/ClaimRequestsActions";
import { Badge } from "@/components/ui/badge";

interface ClaimRequestCardProps {
  request: ClaimRequest;
  onUpdate: (page: number) => Promise<void>;
  currentPage: number;
}

const renderStatusBadge = (status: string) => {
  const statusConfig = {
    NEW: { label: "NEW", className: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-primary/90 bg-blue-900/50 text-blue-300" },
    ACCEPTED: { label: "ACCEPTED", className: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-primary/90 bg-green-900/55 text-green-300" },
    REJECTED: { label: "REJACTED", className: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 bg-red-900/55 text-red-300" }
};

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

    return (
        <Badge variant="secondary" className={config.className}>
            {config.label}
        </Badge>
    );
};

export function ClaimRequestCard({ request, onUpdate, currentPage }: ClaimRequestCardProps) {
  return (
    <Card className="w-full hover:bg-muted/50 transition-colors">
      <CardContent>
        <div className="flex items-start justify-between mb-2 border-b border-border pb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              <a href={`/residences/claim-requests/${request.id}`} className="hover:underline">
                {request.firstName} {request.lastName}
              </a>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5"># {request.id}</p>
            <div className="flex items-center gap-2 mt-1">
              {renderStatusBadge(request.status)}
            </div>
          </div>
          <ClaimRequestsActions row={{ original: request } as any} onUpdate={onUpdate} currentPage={currentPage} />
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {request.residence ? request.residence.name : "No residence assigned"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{request.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {request.phoneCode.code} {request.phoneNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Updated: {new Date(request.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}