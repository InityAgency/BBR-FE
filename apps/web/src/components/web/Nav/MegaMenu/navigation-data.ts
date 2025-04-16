type MenuItem = {
    label: string
    href: string
    description?: string
  }
  
  type MenuContent = {
    [key: string]: MenuItem[]
  }
  
  type NavigationItem = {
    title: string
    href: string // Dodajemo direktan link za glavnu kategoriju
    tabs: string[]
    content: MenuContent
  }
  
  type NavigationData = {
    [key: string]: NavigationItem
  }
  
  export const navigationData: NavigationData = {
    bestResidences: {
      title: "Best Residences",
      href: "/best-residences", // Direktan link
      tabs: [
        "Exclusive Locations",
        "Property Features",
        "Lifestyle Options",
        "Investment Value",
        "Special Amenities",
        "Family Friendly",
      ],
      content: {
        "Exclusive Locations": [
          { label: "Best of Newest Branded Residences", href: "/best/newest" },
          { label: "Best of Investment Opportunities", href: "/best/investment" },
          { label: "Best of Pet-Friendly Residences", href: "/best/pet-friendly" },
          { label: "Best of Beachfront Living", href: "/best/beachfront" },
          { label: "Best of Golf Living", href: "/best/golf" },
          { label: "Best of Emerging Markets", href: "/best/emerging-markets" },
          { label: "Best of Best for Couples", href: "/best/couples" },
          { label: "Best of Cultural Hotspots", href: "/best/cultural-hotspots" },
          { label: "Best of Best for Families", href: "/best/families" },
          { label: "Best of Urban High-Rise", href: "/best/urban-high-rise" },
          { label: "Best for Working Professionals", href: "/best/working-professionals" },
          { label: "Best for Retirement Havens", href: "/best/retirement" },
        ],
        "Property Features": [
          { label: "Best Infinity Pools", href: "/best/infinity-pools" },
          { label: "Best Architectural Design", href: "/best/architecture" },
          { label: "Best Smart Home Technology", href: "/best/smart-home" },
          { label: "Best Private Gardens", href: "/best/gardens" },
        ],
        "Lifestyle Options": [
          { label: "Best for Yacht Club", href: "/best/yacht-club" },
          { label: "Best for Equestrian", href: "/best/equestrian" },
          { label: "Best of Ski Resort Living", href: "/best/ski-resort" },
          { label: "Best of Cultural Hotspots", href: "/best/cultural-hotspots" },
        ],
        "Investment Value": [
          { label: "Best ROI Properties", href: "/best/roi" },
          { label: "Best Rental Income Potential", href: "/best/rental-income" },
          { label: "Best Upcoming Areas", href: "/best/upcoming-areas" },
        ],
        "Special Amenities": [
          { label: "Best of Urban High-Rise", href: "/best/urban-high-rise" },
          { label: "Best for Working Professionals", href: "/best/working-professionals" },
          { label: "Best for Retirement Havens", href: "/best/retirement" },
        ],
        "Family Friendly": [
          { label: "Best for Schools", href: "/best/schools" },
          { label: "Best for Multigenerational Living", href: "/best/multigenerational" },
          { label: "Best Child-Friendly Communities", href: "/best/child-friendly" },
        ],
      },
    },
    allResidences: {
      title: "All Residences",
      href: "/residences", // Direktan link
      tabs: ["Country", "City", "Geographical Area", "Lifestyle", "Property Type", "Price Range"],
      content: {
        Country: [
          { label: "Europe", href: "/residences/europe" },
          { label: "North America", href: "/residences/north-america" },
          { label: "Asia", href: "/residences/asia" },
          { label: "Middle East", href: "/residences/middle-east" },
          { label: "Oceania", href: "/residences/oceania" },
          { label: "South America", href: "/residences/south-america" },
          { label: "Africa", href: "/residences/africa" },
        ],
        City: [
          { label: "New York", href: "/residences/new-york" },
          { label: "London", href: "/residences/london" },
          { label: "Paris", href: "/residences/paris" },
          { label: "Tokyo", href: "/residences/tokyo" },
          { label: "Dubai", href: "/residences/dubai" },
          { label: "Singapore", href: "/residences/singapore" },
          { label: "Sydney", href: "/residences/sydney" },
        ],
        "Geographical Area": [
          { label: "Beach", href: "/residences/beach" },
          { label: "Mountain", href: "/residences/mountain" },
          { label: "Urban", href: "/residences/urban" },
          { label: "Countryside", href: "/residences/countryside" },
          { label: "Island", href: "/residences/island" },
          { label: "Lake", href: "/residences/lake" },
        ],
        Lifestyle: [
          { label: "Family-Friendly", href: "/residences/family-friendly" },
          { label: "Adult-Only", href: "/residences/adult-only" },
          { label: "Business", href: "/residences/business" },
          { label: "Wellness", href: "/residences/wellness" },
          { label: "Adventure", href: "/residences/adventure" },
        ],
        "Property Type": [
          { label: "Hotels", href: "/residences/hotels" },
          { label: "Resorts", href: "/residences/resorts" },
          { label: "Villas", href: "/residences/villas" },
          { label: "Apartments", href: "/residences/apartments" },
          { label: "Chalets", href: "/residences/chalets" },
          { label: "Penthouses", href: "/residences/penthouses" },
        ],
        "Price Range": [
          { label: "Luxury ($1M+)", href: "/residences/luxury" },
          { label: "Premium ($500K-$1M)", href: "/residences/premium" },
          { label: "Mid-Range ($250K-$500K)", href: "/residences/mid-range" },
          { label: "Affordable (Under $250K)", href: "/residences/affordable" },
        ],
      },
    },
    allBrands: {
      title: "All Brands",
      href: "/brands", // Direktan link
      tabs: ["Fashion and Lifestyle Brands", "Automotive Brands", "Luxury Hotel and Resort Brands"],
      content: {
        "Fashion and Lifestyle Brands": [
          { label: "Accor", href: "/brands/accor" },
          { label: "Armani", href: "/brands/armani" },
          { label: "Baccarat", href: "/brands/baccarat" },
          { label: "Bvlgari", href: "/brands/bvlgari" },
          { label: "Cavalli", href: "/brands/cavalli" },
          { label: "Diesel Living", href: "/brands/diesel-living" },
          { label: "Elie Saab", href: "/brands/elie-saab" },
          { label: "Fendi", href: "/brands/fendi" },
          { label: "Giorgio Armani", href: "/brands/giorgio-armani" },
          { label: "Hermès", href: "/brands/hermes" },
          { label: "Karl Lagerfeld", href: "/brands/karl-lagerfeld" },
          { label: "Kenzo", href: "/brands/kenzo" },
          { label: "LVMH", href: "/brands/lvmh" },
          { label: "Missoni", href: "/brands/missoni" },
          { label: "Paramount", href: "/brands/paramount" },
          { label: "Ralph Lauren", href: "/brands/ralph-lauren" },
          { label: "Roberto Cavalli", href: "/brands/roberto-cavalli" },
          { label: "SLS", href: "/brands/sls" },
          { label: "Tommy Hilfiger", href: "/brands/tommy-hilfiger" },
          { label: "Trump", href: "/brands/trump" },
          { label: "Versace", href: "/brands/versace" },
          { label: "Yoo by Philippe Starck", href: "/brands/yoo-by-philippe-starck" },
          { label: "Yoo", href: "/brands/yoo" },
        ],
        "Automotive Brands": [
          { label: "Aston Martin", href: "/brands/aston-martin" },
          { label: "Bentley", href: "/brands/bentley" },
          { label: "Bugatti", href: "/brands/bugatti" },
          { label: "Ferrari", href: "/brands/ferrari" },
          { label: "Lamborghini", href: "/brands/lamborghini" },
          { label: "Mercedes-Benz", href: "/brands/mercedes-benz" },
          { label: "Porsche Design Tower", href: "/brands/porsche-design-tower" },
        ],
        "Luxury Hotel and Resort Brands": [
          { label: "Alila", href: "/brands/alila" },
          { label: "Aman", href: "/brands/aman" },
          { label: "Anantara", href: "/brands/anantara" },
          { label: "Ascott", href: "/brands/ascott" },
          { label: "Banyan Tree", href: "/brands/banyan-tree" },
          { label: "Belmond", href: "/brands/belmond" },
          { label: "Capella", href: "/brands/capella" },
          { label: "Cheval Blanc", href: "/brands/cheval-blanc" },
          { label: "Cheval", href: "/brands/cheval" },
          { label: "Club Quarters", href: "/brands/club-quarters" },
          { label: "Como", href: "/brands/como" },
          { label: "Conrad", href: "/brands/conrad" },
          { label: "Montage", href: "/brands/montage" },
          { label: "DAMAC", href: "/brands/damac" },
          { label: "Discovery Land Company", href: "/brands/discovery-land-company" },
          { label: "Dorchester", href: "/brands/dorchester" },
          { label: "Edition", href: "/brands/edition" },
          { label: "Emaar", href: "/brands/emara" },
          { label: "Equinox", href: "/brands/equinox" },
          { label: "Fairmont", href: "/brands/fairmont" },
          { label: "Four Points", href: "/brands/four-points" },
          { label: "Four Seasons", href: "/brands/four-seasons" },
          { label: "Grand Hyatt", href: "/brands/grand-hyatt" },
          { label: "Hard Rock", href: "/brands/hard-rock" },
          { label: "Hilton", href: "/brands/hilton" },
          { label: "Hyatt Centric", href: "/brands/hyatt-centric" },
          { label: "InterContinental", href: "/brands/intercontinental" },
          { label: "Jumeirah Living", href: "/brands/jumeirah-living" },
          { label: "JW Marriott", href: "/brands/jw-marriott" },
          { label: "Kempinski", href: "/brands/kempinski" },
          { label: "Kerzner International", href: "/brands/kerzner-international" },
          { label: "Mandarin Oriental", href: "/brands/mandarin-oriental" },
          { label: "Marriott", href: "/brands/marriott" },
          { label: "MGM Resorts", href: "/brands/mgm-resorts" },
          { label: "Mövenpick", href: "/brands/movenpick" },
          { label: "ME by Meliá", href: "/brands/me-by-melia" },
          { label: "Montage", href: "/brands/montage" },
          { label: "Morgans Hotel", href: "/brands/morgans-hotel" },
          { label: "Mövenpick", href: "/brands/movenpick" },
          { label: "Oetker Collection", href: "/brands/oetker-collection" },
          { label: "Nobu", href: "/brands/nobu" },
          { label: "Oberoi", href: "/brands/oberoi" },
          { label: "One&Only Private Homes", href: "/brands/one-and-only-private-homes" },
          { label: "One&Only", href: "/brands/one-and-only" },
          { label: "Park Hyatt", href: "/brands/park-hyatt" },
          { label: "Six Senses", href: "/brands/six-senses" },
        ],
      },
    },
  }
  