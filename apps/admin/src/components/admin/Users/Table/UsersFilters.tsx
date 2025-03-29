"use client";

import React from "react";
import { UserRound, CircleDashed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";

interface UsersFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedRoles: string[];
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  uniqueRoles: string[];
  uniqueStatuses: string[];
  filteredRoles: string[];
  roleSearchValue: string;
  setRoleSearchValue: (value: string) => void;
}

export function UsersFilters({
  globalFilter,
  setGlobalFilter,
  selectedRoles,
  setSelectedRoles,
  selectedStatuses,
  setSelectedStatuses,
  uniqueStatuses,
  filteredRoles,
  roleSearchValue,
  setRoleSearchValue,
}: UsersFiltersProps) {
  return (
    <>
      <TableFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        placeholder="Enter user name, email or company..."
      >
        {/* Role Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <UserRound className="h-4 w-4 mr-2" />
              Roles
              {selectedRoles.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedRoles.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search Roles..." 
                value={roleSearchValue}
                onValueChange={setRoleSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredRoles.map((role) => (
                  <CommandItem
                    key={role}
                    onSelect={() => {
                      setSelectedRoles((prev) => {
                        if (prev.includes(role)) {
                          return prev.filter(item => item !== role);
                        } else {
                          return [...prev, role];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedRoles.includes(role)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">{role}</span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedRoles.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedRoles([])}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <CircleDashed className="h-4 w-4 mr-2" />
              Status
              {selectedStatuses.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedStatuses.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No statuses found.</CommandEmpty>
                {uniqueStatuses.map((status) => (
                  <CommandItem
                    key={status}
                    onSelect={() => {
                      setSelectedStatuses((prev) => {
                        if (prev.includes(status)) {
                          return prev.filter(item => item !== status);
                        } else {
                          return [...prev, status];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">{status}</span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedStatuses.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedStatuses([])}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </TableFilters>

      {/* Display active filters */}
      {(selectedRoles.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Role badges */}
          {selectedRoles.map(role => (
            <Badge key={`role-${role}`} variant="secondary" className="px-2 py-1">
              <span className="capitalize">{role}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedRoles(prev => prev.filter(r => r !== role))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Status badges */}
          {selectedStatuses.map(status => (
            <Badge key={`status-${status}`} variant="secondary" className="px-2 py-1">
              <span className="capitalize">{status}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedStatuses(prev => prev.filter(s => s !== status))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Clear all button */}
          {(selectedRoles.length > 1 || selectedStatuses.length > 1) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => {
                setSelectedRoles([]);
                setSelectedStatuses([]);
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </>
  );
}