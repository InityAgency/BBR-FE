"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

// Definisanje tipova za strukture podataka
type MenuItem = {
  label: string;
  href: string;
  description?: string;
};

type MenuName = "bestResidences" | "allResidences" | "allBrands" | null;

type Tabs = {
  [key in Exclude<MenuName, null>]: string[];
};

type MenuContent = {
  [key in Exclude<MenuName, null>]: {
    [key: string]: MenuItem[];
  };
};

type NavigationStep = "main" | "tabs" | "content";

export default function PrimaryNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState<MenuName>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);

  // Za mobilnu navigaciju
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleView, setVisibleView] = useState<NavigationStep>("main");
  const [previousView, setPreviousView] = useState<NavigationStep | null>(null);
  const [activeMobileMenu, setActiveMobileMenu] = useState<Exclude<MenuName, null> | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dodajemo useEffect za praćenje promene rute
  useEffect(() => {
    setActiveMegaMenu(null);
    setIsMobileMenuOpen(false);
    setVisibleView("main");
    setPreviousView(null);
    setActiveMobileMenu(null);
    setIsAnimating(false);
  }, [pathname]);

  const toggleMegaMenu = (menuName: Exclude<MenuName, null>) => {
    if (activeMegaMenu === menuName) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuName);
      setActiveTab(menuTabs[menuName][0]);
    }
  };

  const getMenuTitle = (menuName: Exclude<MenuName, null>): string => {
    switch (menuName) {
      case 'bestResidences': return 'Best Residences';
      case 'allResidences': return 'All Residences';
      case 'allBrands': return 'All Brands';
    }
  };

  const menuTabs: Tabs = {
    bestResidences: ["Exclusive Locations", "Property Features", "Lifestyle Options", "Investment Value", "Special Amenities", "Family Friendly"],
    allResidences: ["Country", "City", "Geographical Area", "Lifestyle", "Property Type", "Price Range"],
    allBrands: ["Fashion and Lifestyle Brands", "Automotive Brands", "Luxury Hotel and Resort Brands"]
  };

  const menuContent: MenuContent = {
    bestResidences: {
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
        { label: "Best for Retirement Havens", href: "/best/retirement" }
      ],
      "Property Features": [
        { label: "Best Infinity Pools", href: "/best/infinity-pools" },
        { label: "Best Architectural Design", href: "/best/architecture" },
        { label: "Best Smart Home Technology", href: "/best/smart-home" },
        { label: "Best Private Gardens", href: "/best/gardens" }
      ],
      "Lifestyle Options": [
        { label: "Best for Yacht Club", href: "/best/yacht-club" },
        { label: "Best for Equestrian", href: "/best/equestrian" },
        { label: "Best of Ski Resort Living", href: "/best/ski-resort" },
        { label: "Best of Cultural Hotspots", href: "/best/cultural-hotspots" }
      ],
      "Investment Value": [
        { label: "Best ROI Properties", href: "/best/roi" },
        { label: "Best Rental Income Potential", href: "/best/rental-income" },
        { label: "Best Upcoming Areas", href: "/best/upcoming-areas" }
      ],
      "Special Amenities": [
        { label: "Best of Urban High-Rise", href: "/best/urban-high-rise" },
        { label: "Best for Working Professionals", href: "/best/working-professionals" },
        { label: "Best for Retirement Havens", href: "/best/retirement" }
      ],
      "Family Friendly": [
        { label: "Best for Schools", href: "/best/schools" },
        { label: "Best for Multigenerational Living", href: "/best/multigenerational" },
        { label: "Best Child-Friendly Communities", href: "/best/child-friendly" }
      ]
    },
    allResidences: {
      "Country": [
        { label: "Europe", href: "/residences/europe" },
        { label: "North America", href: "/residences/north-america" },
        { label: "Asia", href: "/residences/asia" },
        { label: "Middle East", href: "/residences/middle-east" },
        { label: "Oceania", href: "/residences/oceania" },
        { label: "South America", href: "/residences/south-america" },
        { label: "Africa", href: "/residences/africa" }
      ],
      "City": [
        { label: "New York", href: "/residences/new-york" },
        { label: "London", href: "/residences/london" },
        { label: "Paris", href: "/residences/paris" },
        { label: "Tokyo", href: "/residences/tokyo" },
        { label: "Dubai", href: "/residences/dubai" },
        { label: "Singapore", href: "/residences/singapore" },
        { label: "Sydney", href: "/residences/sydney" }
      ],
      "Geographical Area": [
        { label: "Beach", href: "/residences/beach" },
        { label: "Mountain", href: "/residences/mountain" },
        { label: "Urban", href: "/residences/urban" },
        { label: "Countryside", href: "/residences/countryside" },
        { label: "Island", href: "/residences/island" },
        { label: "Lake", href: "/residences/lake" }
      ],
      "Lifestyle": [
        { label: "Family-Friendly", href: "/residences/family-friendly" },
        { label: "Adult-Only", href: "/residences/adult-only" },
        { label: "Business", href: "/residences/business" },
        { label: "Wellness", href: "/residences/wellness" },
        { label: "Adventure", href: "/residences/adventure" }
      ],
      "Property Type": [
        { label: "Hotels", href: "/residences/hotels" },
        { label: "Resorts", href: "/residences/resorts" },
        { label: "Villas", href: "/residences/villas" },
        { label: "Apartments", href: "/residences/apartments" },
        { label: "Chalets", href: "/residences/chalets" },
        { label: "Penthouses", href: "/residences/penthouses" }
      ],
      "Price Range": [
        { label: "Luxury ($1M+)", href: "/residences/luxury" },
        { label: "Premium ($500K-$1M)", href: "/residences/premium" },
        { label: "Mid-Range ($250K-$500K)", href: "/residences/mid-range" },
        { label: "Affordable (Under $250K)", href: "/residences/affordable" }
      ]
    },
    allBrands: {
      "Fashion and Lifestyle Brands": [
        { label: "Accor", href: "/brands/d5ffad0f-caa9-4b0b-b61e-86d6c90eae6d" },
        { label: "Armani", href: "/brands/f10b8ffd-9269-49af-b9ef-be210f41ce63" },
        { label: "Baccarat", href: "/brands/232f8343-66b4-488b-a980-2fb96beb4b06" },
        { label: "Cavalli", href: "/brands/997971d9-c0c4-4f79-a507-2a85f9c832ad" },
        { label: "Bvlgari", href: "/brands/e12d8be0-fced-4aff-a955-b9f2d7e35866" },
        { label: "Diesel Living", href: "/brands/9a3f6f6d-183b-4443-9763-c7455053c08a" },
        { label: "Elie Saab", href: "/brands/0c5e8647-655d-4be4-bdc8-57d2a84b3deb" },
        { label: "Fendi", href: "/brands/0618436b-8f02-49a7-b865-49c05bb03cc5" },
        { label: "Giorgio Armani", href: "/brands/f331baf2-b282-4638-b66c-692577b809d2" },
        { label: "Hermès", href: "/brands/e218b112-69ab-4e1e-8f4f-43f3c3f9d0cb" },
        { label: "Karl Lagerfeld", href: "/brands/c4663188-fbfc-40ff-a810-4783b2a2fa24"},
        { label: "Kenzo", href: "/brands/da46c791-3743-4667-b6e0-988a05c7f978"},
        { label: "LVMH", href: "/brands/baa4448c-44df-4ca6-b75d-a13f4cd952bb"},
        { label: "Missoni", href: "/brands/e5734663-2658-4088-9ccc-8ca3cf80c8f7"},
        { label: "Paramount", href: "/brands/2a8cf044-7384-492e-bdc5-4222876dcbc2"},
        { label: "Ralph Lauren", href: "/brands/22d6eb3c-5ef3-4868-af14-a0f9f8d5ccfd"},
        
        
      ],
      "Automotive Brands": [
        { label: "Aston Martin", href: "/brands/1fde35e7-ba71-4a98-a9be-cf84679046c8" },
        { label: "Bentley", href: "/brands/74b8d073-12bf-4d9d-93fb-6266037269c0" },
        { label: "Bugatti", href: "/brands/bda0b587-57e7-41a5-a87b-51674c30ec34" },
        { label: "Ferrari", href: "/brands/8a2dd78f-c96d-48c6-b2f8-2e201c14be14" },
        { label: "Lamborghini", href: "/brands/9f937aea-3cbb-4257-a4d3-ed2fefdd10d0" },
        { label: "Mercedes-Benz", href: "/brands/e739f99b-fd18-40a4-abe1-d513cc698f57" },
        { label: "Porsche Design Tower", href: "/brands/340db0e3-93a4-4571-989e-5173f6f48e71" },
      ],
      "Luxury Hotel and Resort Brands": [
        { label: "Alila", href: "/brands/a2630e8c-5afe-4ce5-b634-b3ce73906ffb" },
        { label: "Aman", href: "/brands/bba222d8-d18e-4584-9643-b6a75635bf9c" },
        { label: "Anantara", href: "/brands/05c3e57c-4e36-48a7-9ac0-7461646a442b" },
        { label: "Ascott", href: "/brands/e23fa7ab-ca9a-4479-a107-dd6354622191" },
        { label: "Banyan Tree", href: "/brands/01d2163a-6ec4-4ffd-bad4-68e8c18a17c2"},
        { label: "Belmond", href: "/brands/d0c728f9-5241-4d47-a85d-639eabb0271b"},
        { label: "Capella", href: "/brands/94a4e4d6-7f2d-4fe5-898e-a1c6bbd10273"},
        { label: "Cheval Blanc", href: "/brands/6b4b018c-afea-452c-871b-92433a050e16"},
        { label: "Cheval", href: "/brands/e971925d-194c-44fd-ac28-811d83e85b6b"},
        { label: "Club Quarters", href: "/brands/bb4c721a-931c-412e-b091-5d519c96a296"},
        { label: "Como", href: "/brands/1877ad88-b654-4193-a0b0-332ed6eedcb4"},
        { label: "Conrad", href: "/brands/fad54e52-1e02-43b7-a1b2-7520ffc1cc47"},
        { label: "Montage", href: "/brands/4e86b0ec-a44f-4355-97f7-16dc04cc17d5"},
        { label: "DAMAC", href: "/brands/ce027b89-c631-4e58-ac99-d9ae9de1b393"},
        { label: "Six Senses", href: "/brands/0b4322c1-7de1-4909-9986-dfb67dc58a21"},
        { label: "Discovery Land Company", href: "/brands/73d25314-e9e5-43d3-8d7d-f1f7bc3d66a1"},
        { label: "Dorchester", href: "/brands/7aff0fd4-14e4-43d2-8b3c-d5a9232298ed"},
        { label: "Edition", href: "/brands/4252a088-bc74-40f1-8621-ee5ede134629"},
        { label: "Equinox", href: "/brands/5265854b-593d-472b-b39d-0ac82a9532f2"},
        // { label: "Fairmont", href: "/brands/58479014-739a-4c34-8768-da34bd4d8ad2"},
        // { label: "Four Points", href: "/brands/cc755ed9-5303-4055-bdf2-f0d823a4e08d"},
        // { label: "Four Seasons", href: "/brands/ef7b9894-7510-4454-b9b2-1b719b5a05c1"},
        // { label: "Grand Hyatt", href: "/brands/a3e1a83a-292a-43cc-9065-d9a0362dcb09"},
        // { label: "Hard Rock", href: "/brands/d685a6d8-6a22-4c62-89a9-ada74429316f"},
        // { label: "Hilton", href: "/brands/Hilton"},
        // { label: "Hyatt Centric", href: "/brands/4eb56d5c-cb5b-41a9-8e41-0f083432515b"},
        // { label: "Emaar", href: "/brands/9202526e-5c16-4d35-b3c2-af4a3031311b"},
        // { label: "InterContinental", href: "/brands/0d93a503-00a3-4421-aadf-a7f17e357e8b"},
        // { label: "Jumeirah Living", href: "/brands/5caf0ad6-2a10-4835-9ee6-135d9adb6dc6"},
        // { label: "JW Marriott", href: "/brands/5529c50d-dcb8-41f2-a330-a7deb5b298f5"}

      ],
    }
  };

  const navigateForward = (nextView: NavigationStep, menuName?: Exclude<MenuName, null>, tabName?: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setPreviousView(visibleView);
    if (menuName) setActiveMobileMenu(menuName);
    if (tabName) setActiveTab(tabName);
    
    setVisibleView(nextView);
    setTimeout(() => setIsAnimating(false), 300); // Match animation duration
  };

  const navigateBackward = (previousView: NavigationStep) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setPreviousView(visibleView);
    setVisibleView(previousView);
    if (previousView === "main") setActiveMobileMenu(null);
    
    setTimeout(() => setIsAnimating(false), 300); // Match animation duration
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setVisibleView("main");
    setPreviousView(null);
    setActiveMobileMenu(null);
    setIsAnimating(false);
  };

  const getContainerClass = (view: NavigationStep) => {
    if (view === visibleView) {
      return "translate-x-0 opacity-100 z-10";
    }
    if (view === previousView) {
      return "-translate-x-full opacity-0 z-0";
    }
    return "translate-x-full opacity-0 z-0";
  };

  return (
    <div ref={navRef} className="relative">
      <style jsx global>{`
        .mobile-view {
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
        .mobile-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
        }
      `}</style>

      {/* Main navigation bar */}
      <div className="menu-wrapper max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 py-2 bg-secondary rounded-t-lg mt-2 py-8 px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex w-full lg:w-auto justify-between items-center">
            <Link href="/">
              <Image src="/logo-horizontal.svg" alt="Logo" width={100} height={40} />
            </Link>
            <button
              className="lg:hidden cursor-pointer hover:text-primary-400 transition-colors"
              onClick={() => {
                if (!isMobileMenuOpen) {
                  setIsMobileMenuOpen(true);
                  setVisibleView("main");
                  setActiveMobileMenu(null);
                  setPreviousView(null);
                } else {
                  closeMobileMenu();
                }
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-row gap-8 items-center">
            <button 
              onClick={() => toggleMegaMenu('bestResidences')}
              className={`flex flex-row gap-1 items-center ${activeMegaMenu === 'bestResidences' ? 'text-primary-link font-medium' : ''}`}
            >
              Best Residences
              <ChevronDown className={`w-4 h-4 transition-transform ${activeMegaMenu === 'bestResidences' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => toggleMegaMenu('allResidences')}
              className={`flex flex-row gap-1 items-center ${activeMegaMenu === 'allResidences' ? 'text-primary-link font-medium' : ''}`}
            >
              All Residences
              <ChevronDown className={`w-4 h-4 transition-transform ${activeMegaMenu === 'allResidences' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => toggleMegaMenu('allBrands')}
              className={`flex flex-row gap-1 items-center ${activeMegaMenu === 'allBrands' ? 'text-primary-link font-medium' : ''}`}
            >
              All Brands
              <ChevronDown className={`w-4 h-4 transition-transform ${activeMegaMenu === 'allBrands' ? 'rotate-180' : ''}`} />
            </button>
            <Link href="/">Evaluation Criteria</Link>
            <Link href="/">Exclusive Deals</Link>
            <Link href="/blog">Luxury Insights</Link>
          </div>

          <div className="hidden lg:flex">
            <Button className="bg-white/[5%] hover:bg-white/10 text-white py-5 px-5 rounded-lg transition-colors">Contact us</Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-secondary text-white pt-4 z-50 lg:hidden overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-6 flex justify-between items-center0">
              <Image src="/logo-horizontal.svg" alt="Logo" width={100} height={40} />
              <button onClick={closeMobileMenu} className="text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 relative">
              {/* Main Menu */}
              <div className={`mobile-container ${getContainerClass("main")}`}>
                <div className="p-6 mobile-view">
                  <div className="space-y-4">
                    <button onClick={() => navigateForward("tabs", "bestResidences")} className="flex items-center justify-between w-full py-1 ">
                      <span className="text-lg">Best Residences</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => navigateForward("tabs", "allResidences")} className="flex items-center justify-between w-full py-1">
                      <span className="text-lg">All Residences</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => navigateForward("tabs", "allBrands")} className="flex items-center justify-between w-full py-1 ">
                      <span className="text-lg">All Brands</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <Link href="/" className="block py-1 text-lg">Evaluation Criteria</Link>
                    <Link href="/" className="block py-1 text-lg">Exclusive Deals</Link>
                    <Link href="/" className="block py-1 text-lg">Luxury Insights</Link>
                  </div>
                </div>
              </div>

              {/* Tabs View */}
              {activeMobileMenu && (
                <div className={`mobile-container ${getContainerClass("tabs")}`}>
                  <div className="p-6 mobile-view">
                    <div className="flex items-center justify-between border-b border-zinc-300/10 pb-4">
                      <button onClick={() => navigateBackward("main")} className="flex items-center text-primary-400 text-lg">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span>Back</span>
                      </button>
                      <p className="text-sm text-zinc-300/70 uppercase font-medium">{getMenuTitle(activeMobileMenu)}</p>
                    </div>
                    <div className="mt-6 space-y-5">
                      {menuTabs[activeMobileMenu].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => navigateForward("content", undefined, tab)}
                          className="flex items-center justify-between w-full py-1"
                        >
                          <span className="text-lg">{tab}</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content View */}
              {activeMobileMenu && activeTab && (
                <div className={`mobile-container ${getContainerClass("content")}`}>
                  <div className="p-6 mobile-view">
                    <div className="flex items-center justify-between border-b border-zinc-300/10 pb-4">
                        <button onClick={() => navigateBackward("main")} className="flex items-center text-primary-400 text-lg">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        <span>Back</span>
                      </button>
                      <p className="text-sm text-zinc-300/70 uppercase font-medium">{activeTab}</p>
                    </div>
                    <div className="mt-6 space-y-5">
                      {menuContent[activeMobileMenu][activeTab]?.map((item, index) => (
                        <Link key={index} href={item.href} className="block py-1">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8 text-primary">
                      <Link href={`/brands/${activeMobileMenu}/${activeTab}`} className="flex items-center text-primary text-lg font-medium gap-2">
                        View all 
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu - Desktop */}
      {activeMegaMenu && (
        <div className="menu-wrapper max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto absolute left-0 right-0 bg-secondary rounded-b-lg text-white shadow-xl z-50 hidden lg:block">
          <div className="flex flex-row">
            <div className="w-1/5 p-4 border-r border-white/10">
              {menuTabs[activeMegaMenu].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`block w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === tab ? 'text-primary-link font-medium' : 'hover:text-primary-link'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="w-4/5 p-8">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                {activeMegaMenu && activeTab && menuContent[activeMegaMenu][activeTab]?.map((item, index) => (
                  <Link key={index} href={item.href} className="text-white hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Link href={activeMegaMenu && activeTab ? `/brands/${activeMegaMenu}/${activeTab}` : '#'} className="flex items-center text-primary-400">
                  View all <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}