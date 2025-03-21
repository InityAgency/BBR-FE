"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  className?: string;
  variant?: "default" | "destructive";
}

interface TableActionsProps {
  row: Row<any>;
  actions: TableAction[];
  editAction?: {
    href: string;
    icon?: React.ReactNode;
  };
}

export function TableActions({
  row,
  actions,
  editAction,
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {/* Edit button if provided */}
      {editAction && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 cursor-pointer" 
          onClick={() => window.location.href = editAction.href}
        >
          {editAction.icon || (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          )}
        </Button>
      )}
      
      {/* Dropdown menu with actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, index) => (
            <DropdownMenuItem 
              key={index} 
              onClick={() => action.onClick(row.original)}
              className={`${action.className || ""} cursor-pointer`}
            >
              {action.icon && (
                <span className="mr-0">{action.icon}</span>
              )}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}