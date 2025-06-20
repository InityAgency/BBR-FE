"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, Building, Globe } from "lucide-react";
import { B2BFormSubmission } from "@/app/types/models/B2BFormSubmission";
import { formatDate } from "@/lib/formatters";
import { B2BFormSubmissionStatus } from "@/lib/api/services/b2b-form-submissions.service";

interface B2BFormSubmissionsCardListProps {
  submissions: B2BFormSubmission[];
  onViewSubmission: (submission: B2BFormSubmission) => void;
}

export function B2BFormSubmissionsCardList({ 
  submissions, 
  onViewSubmission 
}: B2BFormSubmissionsCardListProps) {
  const getStatusColor = (status: B2BFormSubmissionStatus) => {
    switch (status) {
      case B2BFormSubmissionStatus.NEW:
        return "bg-blue-900/55 text-blue-300";
      case B2BFormSubmissionStatus.CONTACTED:
        return "bg-yellow-900/55 text-yellow-300";
      case B2BFormSubmissionStatus.COMPLETED:
        return "bg-green-900/55 text-green-300";
      default:
        return "bg-blue-900/55 text-blue-300";
    }
  };

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{submission.name}</h3>
                <p className="text-sm text-muted-foreground">{submission.email}</p>
              </div>
              <Badge className={getStatusColor(submission.status)}>
                {submission.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{submission.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{submission.companyName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={submission.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {submission.companyWebsite}
                </a>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Branded Residences: </span>
                <span className="font-medium">{submission.brandedResidencesName}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Created: {formatDate(submission.createdAt)}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onViewSubmission(submission)}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 