"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown,CircleDashed,MapPinPlusInside, MoreHorizontal, Search, X, Filter, Eye, Archive } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const data: Residence[] = [
  {
    id: "1",
    name: "Swissotel Residences, Corniche Park Towers",
    location: "Doha, Qatar",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Developer name",
    developerCode: "DN",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Pending",
  },
  {
    id: "2",
    name: "Four Seasons Private Residences",
    location: "London, UK",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Developer name",
    developerCode: "DN",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Pending",
  },
  {
    id: "3",
    name: "W Residences at Sentosa Cove",
    location: "Dubai, UAE",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Coastal Development",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "4",
    name: "The St. Regis Residences",
    location: "London, UK",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "St. Regis Corp",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "5",
    name: "Layan Residences by Anantara",
    location: "Bangkok, Thailand",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Anantara Group",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "6",
    name: "Four Seasons Private Residences Rome",
    location: "Rome, Italy",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Italian Luxury",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "7",
    name: "The Residences at W Phuket",
    location: "Phuket, Thailand",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Developer name",
    developerCode: "DN",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "8",
    name: "The Residences at Meliá Phuket Karon",
    location: "Madrid, Spain",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Developer name",
    developerCode: "DN",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "9",
    name: "JW Marriott Residences",
    location: "Rome, Italy",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Marriott International",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Active",
  },
  {
    id: "10",
    name: "Tonino Lamborghini Apartments",
    location: "Tokyo, Japan",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Lamborghini Group",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Deleted",
  },
  {
    id: "11",
    name: "Rosewood Residences",
    location: "Rome, Italy",
    contact: "Iva Buzuk",
    contactEmail: "ibuzuk@marriot.com",
    contactPhone: "+385 91 5222 172",
    developer: "Rosewood Hotels",
    developerCode: "",
    createdAt: "Mar 04, 2025",
    updatedAt: "Mar 04, 2025",
    status: "Draft",
  },
  {
    id: "12",
    name: "Panorama Residence",
    location: "Belgrade, Serbia",
    contact: "Marko Markovic",
    contactEmail: "markovic@example.com",
    contactPhone: "+381 65 123 456",
    developer: "Konstruktor",
    developerCode: "",
    createdAt: "Mar 05, 2025",
    updatedAt: "Mar 05, 2025",
    status: "Active",
  },
  {
    id: "13",
    name: "View Towers",
    location: "New York, USA",
    contact: "John Smith",
    contactEmail: "jsmith@example.com",
    contactPhone: "+1 212 555 1234",
    developer: "Metropolitan",
    developerCode: "",
    createdAt: "Mar 06, 2025",
    updatedAt: "Mar 06, 2025",
    status: "Active",
  },
  {
    id: "14",
    name: "Sunset Villas",
    location: "Miami, USA",
    contact: "Emma Johnson",
    contactEmail: "ejohnson@coastal.com",
    contactPhone: "+1 305 555 9876",
    developer: "Coastal Development Group",
    developerCode: "",
    createdAt: "Mar 02, 2025",
    updatedAt: "Mar 07, 2025",
    status: "Draft",
  },
  {
    id: "15",
    name: "Golden Towers",
    location: "Dubai, UAE",
    contact: "Mohammed Al-Farsi",
    contactEmail: "alfarsi@emirates.com",
    contactPhone: "+971 4 123 4567",
    developer: "Emirates Properties",
    developerCode: "",
    createdAt: "Feb 28, 2025",
    updatedAt: "Mar 03, 2025",
    status: "Deleted",
  }
]

export type Residence = {
  id: string
  name: string
  location: string
  contact: string
  contactEmail?: string
  contactPhone?: string
  developer: string
  developerCode?: string
  createdAt: string
  updatedAt: string
  status: "Pending" | "Active" | "Deleted" | "Draft"
}

export const columns: ColumnDef<Residence>[] = [
    {
    id: "select",
    header: ({ table }) => (
        <div className="flex justify-center">
        <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
        </div>
    ),
    cell: ({ row }) => (
        <div className="flex justify-center">
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
        </div>
    ),
    enableSorting: false,
    enableHiding: false,
    },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Residence name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <div className="max-w-[300px]">
          <a href={`/residences/${row.original.id}`} className="font-medium text-foreground hover:underline truncate block" title={name}>
            {name}
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      // Razdvajamo grad i zemlju
      const parts = location.split(", ");
      const city = parts[0];
      const country = parts.length > 1 ? parts[1] : "";
      
      return (
        <div className="max-w-[150px]">
          <div className="truncate font-medium" title={city}>{city}</div>
          {country && (
            <div className="text-xs text-muted-foreground truncate" title={country}>
              {country}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const contact = row.getValue("contact") as string
      const email = row.original.contactEmail
      const phone = row.original.contactPhone
      
      return (
        <div className="max-w-[150px]">
          <div className="font-medium truncate" title={contact}>{contact}</div>
          {email && (
            <a href={`mailto:${email}`} className="text-xs text-primary" title={email}>
                {email}
            </a>
          )}
          {phone && (
            <div className="text-xs text-muted-foreground truncate" title={phone}>
              {phone}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "developer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Developer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const developer = row.getValue("developer") as string
      const developerCode = row.original.developerCode
      
      return (
        <div className="flex items-center gap-2 max-w-[180px]">
          <div className="flex-shrink-0">
            {developerCode ? (
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                {developerCode}
              </div>
            ) : (
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {developer.split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="truncate font-medium" title={developer}>
            {developer}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return <div className="w-[100px]">{date}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string
      return <div className="w-[100px]">{date}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      // Definišemo varijante bedževa prema statusu
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default"
      let badgeClass = ""
      
      switch(status) {
        case "Active":
          badgeVariant = "default"
          badgeClass = "bg-green-900/55 text-green-300"
          break
        case "Pending":
          badgeVariant = "secondary"
          badgeClass = "bg-yellow-900/55 text-yellow-300"
          break
        case "Deleted":
          badgeVariant = "destructive"
          badgeClass = "bg-red-900/55 text-red-300"
          break
        case "Draft":
          badgeVariant = "outline"
          badgeClass = "bg-gray-900/80 text-gray-300"
          break
      }
      
      return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => window.location.href = `/residences/${row.original.id}/edit`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/residences/${row.original.id}`}>
                <Eye />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
                <Archive className="text-red-500"/> 
                Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export function ResidencesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([])
  const [locationSearchValue, setLocationSearchValue] = React.useState("")
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([])

  // Default to sorting by newest creation date
  React.useEffect(() => {
    setSorting([
      { id: "createdAt", desc: true }
    ])
  }, [])

  // Extract unique locations from data
  const uniqueLocations = React.useMemo(() => {
    const locations = data.map(item => item.location)
    return [...new Set(locations)].sort()
  }, [])

  // Extract unique statuses from data
  const uniqueStatuses = React.useMemo(() => {
    const statuses = data.map(item => item.status)
    return [...new Set(statuses)].sort()
  }, [])

  // Filter locations based on search
  const filteredLocations = React.useMemo(() => {
    return uniqueLocations.filter(location => 
      location.toLowerCase().includes(locationSearchValue.toLowerCase())
    )
  }, [uniqueLocations, locationSearchValue])

  // Global fuzzy filter function
  const fuzzyFilter: FilterFn<Residence> = (row, columnId, value, addMeta) => {
    const searchValue = String(value).toLowerCase();
    
    // Search across multiple fields
    const nameValue = String(row.getValue("name") || "").toLowerCase();
    const locationValue = String(row.getValue("location") || "").toLowerCase();
    const developerValue = String(row.getValue("developer") || "").toLowerCase();
    
    return nameValue.includes(searchValue) || 
           locationValue.includes(searchValue) || 
           developerValue.includes(searchValue);
  }

  // Apply location filters when selection changes
  React.useEffect(() => {
    if (selectedLocations.length > 0) {
      table.getColumn("location")?.setFilterValue(selectedLocations);
    } else {
      table.getColumn("location")?.setFilterValue(undefined);
    }
  }, [selectedLocations]);

  // Apply status filters when selection changes
  React.useEffect(() => {
    if (selectedStatuses.length > 0) {
      table.getColumn("status")?.setFilterValue(selectedStatuses);
    } else {
      table.getColumn("status")?.setFilterValue(undefined);
    }
  }, [selectedStatuses]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      // Multi-select filter for locations
      multiSelectFilter: (row, id, filterValue) => {
        const values = filterValue as string[];
        if (!values || values.length === 0) return true;
        
        const rowValue = row.getValue(id) as string;
        return values.includes(rowValue);
      },
    },
    initialState: {
      pagination: {
        pageSize: 12,
      },
      columnVisibility: {
        select: true,
        name: true,
        location: true,
        contact: true,
        developer: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        actions: true,
      },
    },
  })

  // Configure location and status columns to use multi-select filter
  React.useEffect(() => {
    const locationColumn = table.getColumn("location");
    const statusColumn = table.getColumn("status");
    
    if (locationColumn && table.options.filterFns) {
      locationColumn.columnDef.filterFn = table.options.filterFns.multiSelectFilter;
    }
    
    if (statusColumn && table.options.filterFns) {
      statusColumn.columnDef.filterFn = table.options.filterFns.multiSelectFilter;
    }
  }, [table]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4 flex-wrap">
        <Input
          placeholder="Enter residence name, developer or location..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        
        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <MapPinPlusInside className="h-4 w-4 mr-2" />
              Locations
              {selectedLocations.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedLocations.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search Locations..." 
                value={locationSearchValue}
                onValueChange={setLocationSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location}
                    onSelect={() => {
                      setSelectedLocations((prev) => {
                        if (prev.includes(location)) {
                          return prev.filter(item => item !== location);
                        } else {
                          return [...prev, location];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedLocations.includes(location)}
                      className="mr-2 h-4 w-4"
                    />
                    {location}
                  </CommandItem>
                ))}
              </CommandList>
              {selectedLocations.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedLocations([])}
                  >
                    Clear
                    <X className="h-4 w-4" />
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
                    {status}
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
      </div>

      {/* Active Filters Display */}
      {(selectedLocations.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Location filter badges */}
          {selectedLocations.map(location => (
            <Badge key={`loc-${location}`} variant="secondary" className="px-2 py-1">
              {location}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedLocations(prev => prev.filter(l => l !== location))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Status filter badges */}
          {selectedStatuses.map(status => (
            <Badge key={`status-${status}`} variant="secondary" className="px-2 py-1">
              {status}
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
          {(selectedLocations.length > 1 || selectedStatuses.length > 1) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => {
                setSelectedLocations([]);
                setSelectedStatuses([]);
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border w-full overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    // Postavljamo različite širine za različite kolone
                    let widthClass = "";
                    if (header.id === "select") {
                      widthClass = "w-[40px]";
                    } else if (header.id === "name") {
                      widthClass = "w-[250px]";
                    } else if (header.id === "location" || header.id === "developer" || header.id === "contact") {
                      widthClass = "w-[150px]";
                    } else if (header.id === "createdAt" || header.id === "updatedAt") {
                      widthClass = "w-[120px]";
                    } else if (header.id === "status") {
                      widthClass = "w-[100px]";
                    } else if (header.id === "actions") {
                      widthClass = "w-[80px]";
                    }
                    
                    return (
                      <TableHead key={header.id} className={`whitespace-nowrap ${widthClass}`}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => {
                      // Postavljamo iste širine za ćelije kao i za zaglavlja
                      let widthClass = "";
                      if (cell.column.id === "select") {
                        widthClass = "w-[40px]";
                      } else if (cell.column.id === "name") {
                        widthClass = "w-[250px]";
                      } else if (cell.column.id === "location" || cell.column.id === "developer" || cell.column.id === "contact") {
                        widthClass = "w-[150px]";
                      } else if (cell.column.id === "createdAt" || cell.column.id === "updatedAt") {
                        widthClass = "w-[120px]";
                      } else if (cell.column.id === "status") {
                        widthClass = "w-[100px]";
                      } else if (cell.column.id === "actions") {
                        widthClass = "w-[80px]";
                      }
                      
                      return (
                        <TableCell key={cell.id} className={widthClass}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} | of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-4"
          >
            Previous
          </Button>
          {/* Numerisana paginacija */}
          <div className="flex items-center gap-1">
            {/* Generišemo dostupne stranice */}
            {Array.from({ length: table.getPageCount() }, (_, i) => {
              // Za veliki broj stranica, prikazujemo samo relevantne
              const currentPage = table.getState().pagination.pageIndex;
              const totalPages = table.getPageCount();
              
              // Uvek prikazujemo prvu i poslednju stranicu
              // Inače prikazujemo trenutnu stranicu +/- 1 stranicu
              if (
                i === 0 || 
                i === totalPages - 1 ||
                (i >= currentPage - 1 && i <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(i)}
                    className="h-8 w-8 p-0"
                  >
                    {i + 1}
                  </Button>
                );
              }
              
              // Elipsa za srednju prazninu
              if (
                (i === 1 && currentPage > 2) ||
                (i === totalPages - 2 && currentPage < totalPages - 3)
              ) {
                return <span key={i} className="px-1">...</span>;
              }
              
              return null;
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}