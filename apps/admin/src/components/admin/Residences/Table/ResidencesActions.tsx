"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Residence } from "../../../../app/types/models/Residence";

interface ResidencesActionsProps {
  row: Row<Residence>;
}

export function ResidencesActions({ row }: ResidencesActionsProps) {
  // Definišemo akcije specifične za rezidencije
  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (residence: Residence) => {
        window.location.href = `/residences/${residence.id}`;
      }
    },
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      className: "text-red-500",
      onClick: (residence: Residence) => {
        // Ovde bi se nalazila logika za arhiviranje
        console.log(`Archiving residence: ${residence.id}`);
      }
    }
  ];

  return (
    <TableActions 
      row={row} 
      actions={actions}
      editAction={{
        href: `/residences/${row.original.id}/edit`,
      }}
    />
  );
}