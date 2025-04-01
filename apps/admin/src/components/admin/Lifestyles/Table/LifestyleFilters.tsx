"use client"

import React from "react";
import { TableFilters } from "@/components/admin/Table/TableFilters";

interface LifestyleFiltersProps {
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
}

export function LifestyleFilters({ globalFilter, setGlobalFilter }: LifestyleFiltersProps) {
    return (
        <TableFilters
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            placeholder="Search lifestyles..."
        />
    );
}