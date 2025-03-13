// components/admin/Brands/Table/BrandsActions.tsx
"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Brand } from "../../../../app/types/models/Brand";

interface BrandsActionsProps {
  row: Row<Brand>;
}

export function BrandsActions({ row }: BrandsActionsProps) {
  // Definišemo akcije specifične za brendove
  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (brand: Brand) => {
        window.location.href = `/brands/${brand.id}`;
      }
    },
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      className: "text-red-500",
      onClick: (brand: Brand) => {
        // Ovde bi se nalazila logika za arhiviranje
        console.log(`Archiving brand: ${brand.id}`);
      }
    }
  ];

  return (
    <TableActions 
      row={row} 
      actions={actions}
      editAction={{
        href: `/brands/${row.original.id}/edit`,
      }}
    />
  );
}