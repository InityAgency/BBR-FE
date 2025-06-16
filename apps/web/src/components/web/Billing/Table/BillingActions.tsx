"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { BillingTransaction } from "@/types/billing";

interface BillingActionsProps {
  row: Row<BillingTransaction>;
}

export function BillingActions({ row }: BillingActionsProps) {
  const invoiceUrl = row.original.stripeHostingInvoiceUrl;

  if (!invoiceUrl) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => window.open(invoiceUrl, '_blank')}
    >
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
} 