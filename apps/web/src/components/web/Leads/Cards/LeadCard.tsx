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
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card relative transition-transform duration-300 ease-in-out hover:bg-muted/50 transform">
      <div className="flex justify-between items-center mb-2">
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