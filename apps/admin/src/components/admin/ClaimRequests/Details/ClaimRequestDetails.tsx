import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Globe, Building2, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

export function ClaimRequestDetails({ request }: { request: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Applicant Info */}
      <Card className="rounded-xl border-none bg-foreground/5">
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2"><User className="w-4 h-4" />{request.firstName} {request.lastName}</div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{request.email}</div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{request.phoneCode?.code} {request.phoneNumber}</div>
          {request.websiteUrl && (
            <div className="flex items-center gap-2"><Globe className="w-4 h-4" /><a href={request.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">Website <ExternalLink className="w-3 h-3" /></a></div>
          )}
        </CardContent>
      </Card>
      {/* Residence Info */}
      <Card className="rounded-xl border-none bg-foreground/5">
        <CardHeader>
          <CardTitle>Residence Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {request.residence ? (
            <>
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4" />{request.residence.name}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{request.residence.address}</div>
              <div className="flex items-center gap-2">Status: <Badge variant="outline">{request.residence.status}</Badge></div>
            </>
          ) : (
            <div className="text-muted-foreground italic">No residence info</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 