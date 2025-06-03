"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { UnitCard } from "@/components/web/Units/UnitCard"
import { UnitCardSkeleton } from "@/components/web/Units/UnitCardSkeleton"
import type { Unit, UnitsResponse, UnitType, UnitTypesResponse } from "@/types/unit"
import { Pagination } from "@/components/common/Pagination"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Search, Filter, X, SlidersHorizontal, Trash } from "lucide-react"
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock"
import SectionLayout from "@/components/web/SectionLayout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import RequestConsultationForm from "@/components/web/Forms/RequestConsultation"
import Link from "next/link";
import Image from "next/image";
import { RequestInformationModal } from "@/components/web/Modals/RequestInformationModal";


export default function ExclusiveDealsClient() {
  const [units, setUnits] = useState<Unit[]>([])
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([])
  const [loading, setLoading] = useState(true)
  const [unitTypesLoading, setUnitTypesLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("")
  const [unitTypeId, setUnitTypeId] = useState<string>("")
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const debouncedSearch = useDebounce(search, 300)
  const searchParams = useSearchParams()
  const router = useRouter()
  const unitsSectionRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Fetch unit types on component mount
  useEffect(() => {
    fetchUnitTypes()
  }, [])

  // Handle URL params
  useEffect(() => {
    const page = searchParams.get("page") || "1"
    const query = searchParams.get("query") || ""
    const unitStatus = searchParams.get("status") || ""
    const type = searchParams.get("unitTypeId") || ""

    setCurrentPage(Number.parseInt(page))
    setSearch(query)
    setStatus(unitStatus)
    setUnitTypeId(type)

    fetchUnits(Number.parseInt(page), query, unitStatus, type)
  }, [searchParams])

  // Handle search changes
  useEffect(() => {
    updateUrlWithFilters(1)
  }, [debouncedSearch])

  // Upravljanje animacijom filtera
  const hasActiveFilters = search || status || unitTypeId
  
  useEffect(() => {
    if (hasActiveFilters) {
      setFiltersVisible(true)
    } else {
      const timer = setTimeout(() => {
        setFiltersVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [hasActiveFilters])

  const fetchUnitTypes = async () => {
    try {
      setUnitTypesLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/unit-types`)
      const data: UnitTypesResponse = await response.json()
      setUnitTypes(data.data)
    } catch (error) {
      console.error("Error fetching unit types:", error)
    } finally {
      setUnitTypesLoading(false)
    }
  }

  const fetchUnits = async (page: number, query = "", unitStatus = "", type = "") => {
    try {
      setLoading(true)
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/units`,
      )

      // Add pagination params
      url.searchParams.set("page", page.toString())
      url.searchParams.set("limit", user ? "12" : "9") // Prikaži 9 jedinica za neulogovane korisnike, 12 za ulogovane

      // Add filter params
      if (query) {
        url.searchParams.set("query", query)
      }

      if (unitStatus) {
        url.searchParams.set("status", unitStatus)
      }

      if (type) {
        url.searchParams.set("unitTypeId", type)
      }

      const response = await fetch(url.toString())
      const data: UnitsResponse = await response.json()
      setUnits(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Error fetching units:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUrlWithFilters = (page: number = currentPage) => {
    const params = new URLSearchParams()

    // Add all filter params
    params.set("page", page.toString())

    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }

    if (status) {
      params.set("status", status)
    }

    if (unitTypeId) {
      params.set("unitTypeId", unitTypeId)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handlePageChange = (page: number) => {
    updateUrlWithFilters(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusChange = (value: string) => {
    const selectedValue = value === "ALL" ? "" : value
    setStatus(selectedValue)
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (value !== "ALL") {
      params.set("status", value)
    }
    
    if (unitTypeId) {
      params.set("unitTypeId", unitTypeId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleTypeChange = (value: string) => {
    const newType = value === "ALL" ? "" : value
    setUnitTypeId(newType)
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (status) {
      params.set("status", status)
    }
    
    if (value !== "ALL") {
      params.set("unitTypeId", value)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setUnitTypeId("")

    const params = new URLSearchParams()
    params.set("page", "1")
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Funkcije za brisanje pojedinačnih filtera
  const clearSearchFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setSearch("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (status) {
      params.set("status", status)
    }
    
    if (unitTypeId) {
      params.set("unitTypeId", unitTypeId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearStatusFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setStatus("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (unitTypeId) {
      params.set("unitTypeId", unitTypeId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearTypeFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setUnitTypeId("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (status) {
      params.set("status", status)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Get the selected unit type name for display in the filter badge
  const getSelectedUnitTypeName = () => {
    if (!unitTypeId) return null
    const selectedType = unitTypes.find((type) => type.id === unitTypeId)
    return selectedType?.name
  }

  // Broj aktivnih filtera
  const activeFiltersCount = [search, status, unitTypeId].filter(Boolean).length

  return (
    <>
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
        <div className="page-header flex flex-col gap-6 w-full">
          <p className="text-md uppercase text-left lg:text-center text-primary">Exclusive offers</p>
          <h1 className="text-4xl font-bold text-left lg:text-center xl:max-w-[60%] lg:m-auto">Discover Exclusive Opportunities on Best Branded Residences</h1>
        </div>
      </div>
      <SectionLayout>
        <div ref={unitsSectionRef} className="w-full xl:max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-1 lg:gap-4 w-full">
            <div>
              {/* Desktop filteri */}
              <div className="flex gap-4 unit-filters">
                <div className="w-full mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <Input
                      placeholder="Search units..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between mb-4">
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All statuses</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="RESERVED">Reserved</SelectItem>
                      <SelectItem value="SOLD">Sold</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={unitTypeId} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All types</SelectItem>
                      {unitTypesLoading ? (
                        <SelectItem value="LOADING" disabled>
                          Loading types...
                        </SelectItem>
                      ) : (
                        unitTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobilno dugme za filtere */}
              <div className="lg:hidden w-full mb-4 unit-filters">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsFilterDrawerOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Drawer za mobilne filtere */}
              <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
                <DrawerContent>
                  <DrawerHeader className="flex flex-row items-center justify-between">
                    <DrawerTitle className="text-2xl">Filters</DrawerTitle>
                    <Button onClick={clearFilters} variant="link" className="w-fit">
                      <Trash className="w-4 h-4" />
                      Clear Filters
                    </Button>
                  </DrawerHeader>
                  <div className="px-4 py-2 space-y-4 unit-filters">
                    {/* Status filter */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All statuses</SelectItem>
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="RESERVED">Reserved</SelectItem>
                          <SelectItem value="SOLD">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Type filter */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={unitTypeId} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All types</SelectItem>
                          {unitTypesLoading ? (
                            <SelectItem value="LOADING" disabled>
                              Loading types...
                            </SelectItem>
                          ) : (
                            unitTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prikaz aktivnih filtera u drawer-u */}
                    {hasActiveFilters && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Active Filters</label>
                        <div className="flex flex-wrap gap-2">
                          {status && (
                            <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm">
                              Status: {status}
                              <button 
                                onClick={clearStatusFilter} 
                                className="h-4 w-4 ml-1 flex items-center justify-center"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </Badge>
                          )}

                          {unitTypeId && getSelectedUnitTypeName() && (
                            <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm">
                              Type: {getSelectedUnitTypeName()}
                              <button 
                                onClick={clearTypeFilter} 
                                className="h-4 w-4 ml-1 flex items-center justify-center"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button className="w-full">Apply Filters</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {/* Active filters display sa animacijom - samo za desktop */}
              <div 
                className={`
                  hidden lg:block mt-6 overflow-hidden transition-all duration-300 ease-in-out
                  ${hasActiveFilters 
                    ? 'max-h-40 md:max-h-24 opacity-100 transform scale-y-100 origin-top' 
                    : 'max-h-0 opacity-0 transform scale-y-95 origin-top'} 
                `}
              >
                {filtersVisible && (
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-md text-muted-foreground">Active filters:</span>
                    </div>

                    {search && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Search: {search}
                        <button 
                          onClick={clearSearchFilter} 
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear search filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}

                    {status && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Status: {status}
                        <button 
                          onClick={clearStatusFilter} 
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear status filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}

                    {unitTypeId && getSelectedUnitTypeName() && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Type: {getSelectedUnitTypeName()}
                        <button 
                          onClick={clearTypeFilter} 
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear type filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8 w-full">
                {[...Array(user ? 12 : 9)].map((_, i) => (
                  <UnitCardSkeleton key={i} />
                ))}
              </div>
            ) : units.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                  {units.map((unit) => (
                    <UnitCard 
                      key={unit.id} 
                      unit={unit} 
                      onRequestInfo={(unit) => {
                        setSelectedUnit(unit);
                        setIsRequestInfoModalOpen(true);
                      }}
                    />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="min-h-24 w-full border rounded-lg bg-secondary flex items-center justify-center flex-col py-12 mt-8">
                <p className="text-xl font-medium mb-2">No units found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </SectionLayout>

      <section className="bg-secondary">
        <SectionLayout>
            <div className="flex flex-col gap-4 mb-8 items-start lg:max-w-[55%] lg:m-auto mb-4 lg:mb-12">
                <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">still have any questions?</span>
                <h2 className="text-4xl font-bold text-left lg:text-center w-full">
                    Connect with our team of  branded residence experts
                </h2>
                <p className="text-left text-md text-muted-foreground w-full lg:text-center">
                    Get personalized assistance to any request about branded residences and learn the best solutions for your project needs
                </p>
            </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full xl:max-w-[1600px] mx-auto">
            {/* Left side - Image and Schedule */}
            <div className="flex flex-col gap-4 items-stretch">
              <div className="border rounded-lg h-full p-4">
                <Image
                    src="/faq-buyer.webp"
                    alt="Expert Consultant"
                    className="w-full h-full object-cover rounded-md mb-4"
                    width={1000}
                    height={500}
                />
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Schedule an online meeting</h3>
                <p className="text-white/70 mb-4">
                    You can easily schedule your meeting and have a meeting with our consultants in the fastest time possible.
                </p>
                <Link href="/" className="bg-[#151b1e] hover:bg-[#192024]  border text-white py-3 px-5 rounded-lg transition-colors contact-button text-center flex items-center gap-2 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                    <path d="M18 6.25016V5.00016C18 4.55814 17.8244 4.13421 17.5118 3.82165C17.1993 3.50909 16.7754 3.3335 16.3333 3.3335H4.66667C4.22464 3.3335 3.80072 3.50909 3.48816 3.82165C3.17559 4.13421 3 4.55814 3 5.00016V16.6668C3 17.1089 3.17559 17.5328 3.48816 17.8453C3.80072 18.1579 4.22464 18.3335 4.66667 18.3335H7.58333" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.8333 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.16669 1.6665V4.99984" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 8.3335H7.16667" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.0833 14.5832L13.8333 13.5415V11.6665" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.8333 13.3335C18.8333 14.6596 18.3065 15.9313 17.3688 16.869C16.4312 17.8067 15.1594 18.3335 13.8333 18.3335C12.5072 18.3335 11.2355 17.8067 10.2978 16.869C9.3601 15.9313 8.83331 14.6596 8.83331 13.3335C8.83331 12.0074 9.3601 10.7356 10.2978 9.79796C11.2355 8.86028 12.5072 8.3335 13.8333 8.3335C15.1594 8.3335 16.4312 8.86028 17.3688 9.79796C18.3065 10.7356 18.8333 12.0074 18.8333 13.3335Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Schedule a Call
                </Link>
              </div>
            </div>

            {/* Right side - Contact Form */}
            <RequestConsultationForm />
          </div>
        </SectionLayout>
      </section>
      <NewsletterBlock />
      <RequestInformationModal 
        isOpen={isRequestInfoModalOpen}
        onClose={() => {
          setIsRequestInfoModalOpen(false);
          setSelectedUnit(null);
        }}
        entityId={selectedUnit?.id} 
        type="MORE_INFORMATION" 
        buttonText="Request More Information"
        customTitle={selectedUnit ? `Would you like to know more about ${selectedUnit.name}?` : undefined}
      />
    </>
  )
}
