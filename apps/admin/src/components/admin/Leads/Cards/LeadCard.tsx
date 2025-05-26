import { Lead } from "@/app/types/models/Lead";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { LeadsActions } from "../Table/LeadsActions";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const statusColors: Record<string, string> = {
    NEW: "bg-yellow-900/55 text-yellow-300",
    CONTACTED: "bg-blue-900/55 text-blue-300",
    QUALIFIED: "bg-purple-900/55 text-purple-300",
    WON: "bg-green-900/55 text-green-300",
    LOST: "bg-red-900/55 text-red-300",
    INACTIVE: "bg-gray-900/80 text-gray-300",
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card relative transition-transform duration-300 ease-in-out hover:bg-muted/50 transform">
      <div className="flex justify-between items-center mb-2">
        <Badge className={`${statusColors[lead.status] || "bg-gray-500"} text-white`}>
          {lead.status}
        </Badge>
        <LeadsActions row={{ original: lead } as any} />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <div className="font-bold text-lg truncate">
          {lead.firstName} {lead.lastName}
        </div>
        <div className="text-sm text-muted-foreground truncate">{lead.email}</div>
        {lead.phone && <div className="text-sm text-muted-foreground truncate">{lead.phone}</div>}
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="text-xs text-muted-foreground">
          Created: {format(new Date(lead.createdAt), "dd.MM.yyyy. HH:mm")}
        </div>
      </div>
    </div>
  );
} 