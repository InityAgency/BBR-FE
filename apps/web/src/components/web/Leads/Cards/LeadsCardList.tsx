"use client";

import React from "react";
import { Lead } from "@/app/types/models/Lead";
import { LeadCard } from "./LeadCard";

interface LeadsCardListProps {
  leads: Lead[];
}

export function LeadsCardList({ leads }: LeadsCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
} 