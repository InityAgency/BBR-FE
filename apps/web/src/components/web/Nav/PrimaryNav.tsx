"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
    allBrands: ["Luxury Brands", "Premium Brands", "Boutique Collections", "Resort Chains", "Villa Networks", "Membership Clubs"]
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
      "Luxury Brands": [
        { label: "Four Seasons", href: "/brands/four-seasons" },
        { label: "Aman Resorts", href: "/brands/aman" },
        { label: "Ritz-Carlton", href: "/brands/ritz-carlton" },
        { label: "One&Only", href: "/brands/one-and-only" },
        { label: "Six Senses", href: "/brands/six-senses" }
      ],
      "Premium Brands": [
        { label: "Marriott", href: "/brands/marriott" },
        { label: "Hilton", href: "/brands/hilton" },
        { label: "Hyatt", href: "/brands/hyatt" },
        { label: "InterContinental", href: "/brands/intercontinental" },
        { label: "Westin", href: "/brands/westin" }
      ],
      "Boutique Collections": [
        { label: "Design Hotels", href: "/brands/design-hotels" },
        { label: "Small Luxury Hotels", href: "/brands/slh" },
        { label: "Autograph Collection", href: "/brands/autograph" },
        { label: "Leading Hotels of the World", href: "/brands/lhw" }
      ],
      "Resort Chains": [
        { label: "Club Med", href: "/brands/club-med" },
        { label: "Sandals", href: "/brands/sandals" },
        { label: "Banyan Tree", href: "/brands/banyan-tree" },
        { label: "Anantara", href: "/brands/anantara" }
      ],
      "Villa Networks": [
        { label: "Airbnb Luxe", href: "/brands/airbnb-luxe" },
        { label: "Exclusive Resorts", href: "/brands/exclusive-resorts" },
        { label: "The Hideaways Club", href: "/brands/hideaways" }
      ],
      "Membership Clubs": [
        { label: "Soho House", href: "/brands/soho-house" },
        { label: "Quintessentially", href: "/brands/quintessentially" },
        { label: "Inspirato", href: "/brands/inspirato" }
      ]
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
      <div className="max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 py-2 bg-secondary rounded-t-lg mt-2 py-8 px-8">
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
            <Link href="/">Luxury Insights</Link>
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
                      <Link href={`/view-all/${activeMobileMenu}/${activeTab}`} className="flex items-center text-primary text-lg font-medium gap-2">
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
        <div className="max-w-[calc(100svw-3rem)] 2xl:max-w-[80svw] mx-auto absolute left-0 right-0 bg-secondary rounded-b-lg text-white shadow-xl z-50 hidden lg:block">
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
                <Link href={activeMegaMenu && activeTab ? `/view-all/${activeMegaMenu}/${activeTab}` : '#'} className="flex items-center text-primary-400">
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