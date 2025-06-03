"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard"
import { ResidenceCardSkeleton } from "@/components/web/Residences/ResidenceCardSkeleton"
import type { Residence, ResidencesResponse } from "@/types/residence"
import type { Brand, BrandsResponse } from "@/types/brand"
import { Pagination } from "@/components/common/Pagination"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Search, Filter, X, SlidersHorizontal, Trash } from "lucide-react"
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock"
import SectionLayout from "@/components/web/SectionLayout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

// Dodajemo City interfejs
interface City {
  country: {
    name: string
  }
  id: string
  name: string
}

interface CitiesResponse {
  data: City[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

export default function ResidencesClient() {
  const [residences, setResidences] = useState<Residence[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [developmentStatus, setDevelopmentStatus] = useState<string>("")
  const [brandId, setBrandId] = useState<string>("")
  const [cityId, setCityId] = useState<string>("")
  const [citySearchQuery, setCitySearchQuery] = useState<string>("")
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const searchParams = useSearchParams()
  const router = useRouter()
  const residencesSectionRef = useRef<HTMLDivElement>(null)

  // Fetch brands and cities on component mount
  useEffect(() => {
    fetchBrands()
    fetchCities()
  }, [])

  // Handle URL params
  useEffect(() => {
    const page = searchParams.get("page") || "1"
    const query = searchParams.get("query") || ""
    const status = searchParams.get("developmentStatus") || ""
    const brand = searchParams.get("brandId") || ""
    const city = searchParams.get("cityId") || ""

    setCurrentPage(Number.parseInt(page))
    setSearch(query)
    setDevelopmentStatus(status)
    setBrandId(brand)
    setCityId(city)

    fetchResidences(Number.parseInt(page), query, status, brand, city)
  }, [searchParams])

  // Handle search changes
  useEffect(() => {
    updateUrlWithFilters(1)
  }, [debouncedSearch])

  // Upravljanje animacijom filtera
  const hasActiveFilters = search || developmentStatus || brandId || cityId
  
  useEffect(() => {
    if (hasActiveFilters) {
      setFiltersVisible(true)
    } else {
      // Sačekaj da se završi animacija pre nego što se element ukloni
      const timer = setTimeout(() => {
        setFiltersVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [hasActiveFilters])

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true)
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/brands`)
      url.searchParams.set("limit", "100") // Get all brands for the filter

      const response = await fetch(url.toString())
      const data: BrandsResponse = await response.json()
      setBrands(data.data)
    } catch (error) {
      console.error("Error fetching brands:", error)
    } finally {
      setBrandsLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      setCitiesLoading(true)
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/cities`)
      url.searchParams.set("limit", "100") // Get all cities for the filter

      const response = await fetch(url.toString())
      const data: CitiesResponse = await response.json()
      setCities(data.data)
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setCitiesLoading(false)
    }
  }

  const fetchResidences = async (page: number, query = "", status = "", brand = "", city = "") => {
    try {
      setLoading(true)
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences`,
      )

      // Add pagination params
      url.searchParams.set("page", page.toString())
      url.searchParams.set("limit", "12")

      // Add filter params
      if (query) {
        url.searchParams.set("query", query)
      }

      if (status) {
        url.searchParams.set("developmentStatus", status)
      }

      if (brand) {
        url.searchParams.set("brandId", brand)
      }

      if (city) {
        url.searchParams.set("cityId", city)
      }

      const response = await fetch(url.toString())
      const data: ResidencesResponse = await response.json()
      setResidences(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Error fetching residences:", error)
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

    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus)
    }

    if (brandId) {
      params.set("brandId", brandId)
    }

    if (cityId) {
      params.set("cityId", cityId)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handlePageChange = (page: number) => {
    updateUrlWithFilters(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleDevelopmentStatusChange = (value: string) => {
    const selectedValue = value === "ALL" ? "" : value
    setDevelopmentStatus(selectedValue)
    // Odmah pozovi updateUrlWithFilters sa ažuriranim developmentStatus vrednostima
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (value !== "ALL") {
      params.set("developmentStatus", value)
    }
    
    if (brandId) {
      params.set("brandId", brandId)
    }
    
    if (cityId) {
      params.set("cityId", cityId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleBrandChange = (value: string) => {
    const newBrandId = value === "ALL" ? "" : value
    setBrandId(newBrandId)
    // Odmah pozovi updateUrlWithFilters sa ažuriranim brandId vrednostima
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus)
    }
    
    if (value !== "ALL") {
      params.set("brandId", value)
    }
    
    if (cityId) {
      params.set("cityId", cityId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleCityChange = (value: string) => {
    const newCityId = value === "ALL" ? "" : value
    setCityId(newCityId)
    // Resetuj pretragu gradova nakon izbora
    setCitySearchQuery("")
    // Odmah pozovi updateUrlWithFilters sa ažuriranim cityId vrednostima
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus)
    }
    
    if (brandId) {
      params.set("brandId", brandId)
    }
    
    if (value !== "ALL") {
      params.set("cityId", value)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitySearchQuery(e.target.value)
  }

  const clearFilters = () => {
    setSearch("")
    setDevelopmentStatus("")
    setBrandId("")
    setCityId("")
    setCitySearchQuery("")

    const params = new URLSearchParams()
    params.set("page", "1")
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Funkcije za brisanje pojedinačnih filtera
  const clearSearchFilter = (e?: React.MouseEvent) => {
    // Zaustavite propagaciju događaja ako postoji
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setSearch("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus)
    }
    
    if (brandId) {
      params.set("brandId", brandId)
    }
    
    if (cityId) {
      params.set("cityId", cityId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearDevelopmentStatusFilter = (e?: React.MouseEvent) => {
    // Zaustavite propagaciju događaja ako postoji
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setDevelopmentStatus("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (brandId) {
      params.set("brandId", brandId)
    }
    
    if (cityId) {
      params.set("cityId", cityId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearBrandFilter = (e?: React.MouseEvent) => {
    // Zaustavite propagaciju događaja ako postoji
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setBrandId("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus)
    }
    
    if (cityId) {
      params.set("cityId", cityId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearCityFilter = (e?: React.MouseEvent) => {
    // Zaustavite propagaciju događaja ako postoji
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setCityId("")
    setCitySearchQuery("")
    
    const params = new URLSearchParams()
    params.set("page", "1")
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch)
    }
    
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus)
    }
    
    if (brandId) {
      params.set("brandId", brandId)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Get the selected brand name for display in the filter badge
  const getSelectedBrandName = () => {
    if (!brandId) return null
    const selectedBrand = brands.find((brand) => brand.id === brandId)
    return selectedBrand?.name
  }

  // Get the selected city name for display in the filter badge
  const getSelectedCityName = () => {
    if (!cityId) return null
    const selectedCity = cities.find((city) => city.id === cityId)
    return selectedCity?.name
  }

  // Filtriramo gradove prema upitu
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  )

  // Broj aktivnih filtera
  const activeFiltersCount = [search, developmentStatus, brandId, cityId].filter(Boolean).length

  return (
    <>
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
        <div className="page-header flex flex-col gap-6 w-full">
          <p className="text-md uppercase text-left lg:text-center text-primary">PROPERTY DIRECTORY</p>
          <h1 className="text-4xl font-bold text-left lg:text-center">Meet the Elite Residence Properties</h1>
        </div>
      </div>
      <SectionLayout>
        <div ref={residencesSectionRef} className="w-full xl:max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-1 lg:gap-4 w-full">
            <div>

              {/* Desktop filteri */}
              <div className="flex gap-4 residence-filters">
                <div className="w-full mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <Input
                      placeholder="Search residences..."
                      value={search}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between mb-4">
        
                  <Select value={cityId} onValueChange={handleCityChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 sticky top-0 bg-background z-10 search-wrapper">
                        <Input
                          placeholder="Search locations..."
                          value={citySearchQuery}
                          onChange={handleCitySearchChange}
                          className="w-full"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            // Sprečavamo da Select reaguje na tipke koje koristimo za input
                            if (e.key !== "Escape" && e.key !== "Enter") {
                              e.stopPropagation();
                            }
                          }}
                        />
                      </div>
                      <SelectItem value="ALL">All locations</SelectItem>
                      {citiesLoading ? (
                        <SelectItem value="LOADING" disabled>
                          Loading locations...
                        </SelectItem>
                      ) : filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name} <span className="text-xs text-muted-foreground">{city.country.name}</span>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No locations found
                        </div>
                      )}
                    </SelectContent>
                  </Select>

                  <Select value={developmentStatus} onValueChange={handleDevelopmentStatusChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Development status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All statuses</SelectItem>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                      <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={brandId} onValueChange={handleBrandChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All brands</SelectItem>
                      {brandsLoading ? (
                        <SelectItem value="LOADING" disabled>
                          Loading brands...
                        </SelectItem>
                      ) : (
                        brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobilno dugme za filtere */}
              <div className="lg:hidden w-full mb-4 residence-filters">
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
                  <div className="px-4 py-2 space-y-4 residence-filters">
                    {/* Location filter */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-sm font-medium">Location</label>
                      <Select value={cityId} onValueChange={handleCityChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All locations</SelectItem>
                          {citiesLoading ? (
                            <SelectItem value="LOADING" disabled>
                              Loading locations...
                            </SelectItem>
                          ) : filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>
                                {city.name} <span className="text-xs text-muted-foreground">{city.country.name}</span>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                              No locations found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Development status filter */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-sm font-medium">Development Status</label>
                      <Select value={developmentStatus} onValueChange={handleDevelopmentStatusChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All statuses</SelectItem>
                          <SelectItem value="PLANNED">Planned</SelectItem>
                          <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Brand filter */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-sm font-medium">Brand</label>
                      <Select value={brandId} onValueChange={handleBrandChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All brands</SelectItem>
                          {brandsLoading ? (
                            <SelectItem value="LOADING" disabled>
                              Loading brands...
                            </SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
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
                          {cityId && getSelectedCityName() && (
                            <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm">
                              Location: {getSelectedCityName()}
                              <button 
                                onClick={clearCityFilter} 
                                className="h-4 w-4 ml-1 flex items-center justify-center"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </Badge>
                          )}

                          {developmentStatus && (
                            <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm">
                              Status: {developmentStatus.replace("_", " ")}
                              <button 
                                onClick={clearDevelopmentStatusFilter} 
                                className="h-4 w-4 ml-1 flex items-center justify-center"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </Badge>
                          )}

                          {brandId && getSelectedBrandName() && (
                            <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm">
                              Brand: {getSelectedBrandName()}
                              <button 
                                onClick={clearBrandFilter} 
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

                    {developmentStatus && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Status: {developmentStatus.replace("_", " ")}
                        <button 
                          onClick={clearDevelopmentStatusFilter} 
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear status filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}

                    {brandId && getSelectedBrandName() && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Brand: {getSelectedBrandName()}
                        <button 
                          onClick={clearBrandFilter} 
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear brand filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}

                    {cityId && getSelectedCityName() && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Location: {getSelectedCityName()}
                        <button 
                          onClick={clearCityFilter} 
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear location filter"
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
                {[...Array(12)].map((_, i) => (
                  <ResidenceCardSkeleton key={i} />
                ))}
              </div>
            ) : residences.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                  {residences.map((residence) => (
                    <ResidenceCard key={residence.id} residence={residence} />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="min-h-24 w-full border rounded-lg bg-secondary flex items-center justify-center flex-col py-12 mt-8">
                <p className="text-xl font-medium mb-2">No residences found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </SectionLayout>
      <NewsletterBlock />
    </>
  )
}