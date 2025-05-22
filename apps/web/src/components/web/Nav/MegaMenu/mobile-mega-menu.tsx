"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationData } from "./navigation-data"

type NavigationStep = "main" | "tabs" | "content"
type NavigationData = typeof navigationData;

interface MobileMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  animationType?: "slide-right" | "slide-down"
  navigationData: NavigationData
}

export function MobileMegaMenu({ 
  isOpen, 
  onClose, 
  animationType = "slide-right",
  navigationData 
}: MobileMegaMenuProps) {
  const [visibleView, setVisibleView] = useState<NavigationStep>("main")
  const [previousView, setPreviousView] = useState<NavigationStep | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Kontrola animacije otvaranja/zatvaranja
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    } else {
      // Dajemo vreme da se završi animacija zatvaranja pre nego što uklonimo komponentu
      const timer = setTimeout(() => {
        setMounted(false)
      }, 300) // Trajanje animacije
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Ako nije montiran, ne prikazujemo ništa
  if (!mounted) return null

  const navigateForward = (nextView: NavigationStep, menuName?: string, tabName?: string) => {
    if (isAnimating) return
    setIsAnimating(true)

    setPreviousView(visibleView)
    if (menuName) setActiveMenu(menuName)
    if (tabName) setActiveTab(tabName)

    setVisibleView(nextView)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const navigateBackward = (previousView: NavigationStep) => {
    if (isAnimating) return
    setIsAnimating(true)

    setPreviousView(visibleView)
    setVisibleView(previousView)
    if (previousView === "main") setActiveMenu(null)

    setTimeout(() => setIsAnimating(false), 300)
  }

  const getContainerClass = (view: NavigationStep) => {
    if (view === visibleView) {
      return "translate-x-0 opacity-100 z-10"
    }
    if (view === previousView) {
      return "-translate-x-full opacity-0 z-0"
    }
    return "translate-x-full opacity-0 z-0"
  }

  // Funkcija za prikazivanje linka "View all"
  const getViewAllText = (menuName: string) => {
    switch (menuName) {
      case "allBrands":
        return "View all Brands"
      case "bestResidences":
        return "View all Best Residences"
      case "allResidences":
      default:
        return "View all Residences"
    }
  }

  // Klase za animaciju otvaranja/zatvaranja
  const menuAnimationClasses = cn(
    "fixed inset-0 bg-secondary text-white pt-4 z-50 lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
    animationType === "slide-right"
      ? isOpen
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
      : isOpen
        ? "translate-y-0 opacity-100"
        : "-translate-y-full opacity-0",
  )

  // Dodajemo backdrop blur efekat
  const backdropClasses = cn(
    "fixed inset-0 bg-secondary backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
  )

  return (
    <>
      {/* Backdrop */}
      <div className={backdropClasses} onClick={onClose} />

      {/* Mobile Menu */}
      <div className={menuAnimationClasses}>
        <style jsx global>{`
          .mobile-view {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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

        <div className="h-full flex flex-col">
          <div className="p-6 flex justify-between items-center">
            <Image src="/logo-horizontal.svg" alt="Logo" width={100} height={40} className="h-10 w-auto" />
            <button
              onClick={onClose}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 relative">
            {/* Main Menu */}
            <div className={cn("mobile-container", getContainerClass("main"))}>
              <div className="p-6 mobile-view">
                <div className="space-y-4">
                  {Object.keys(navigationData).map((menuName) => (
                    <div key={menuName} className="flex flex-col">
                      <Link
                        href={navigationData[menuName].href}
                        className="text-lg font-medium text-white hover:text-[#b3804c] transition-colors"
                        onClick={onClose}
                      >
                        {navigationData[menuName].title}
                      </Link>
                      {navigationData[menuName].tabs.length > 0 && (
                        <button
                          onClick={() => navigateForward("tabs", menuName)}
                          className="flex items-center text-md text-[#b3804c] mt-2"
                        >
                          View subcategories <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Link
                    href="/criteria"
                    className="block py-1 text-lg text-white hover:text-[#b3804c] transition-colors"
                    onClick={onClose}
                  >
                    Evaluation Criteria
                  </Link>
                  <Link 
                    href="/deals" 
                    className="block py-1 text-lg text-white hover:text-[#b3804c] transition-colors"
                    onClick={onClose}
                  >
                    Exclusive Deals
                  </Link>
                  <Link
                    href="/blog"
                    className="block py-1 text-lg text-white hover:text-[#b3804c] transition-colors"
                    onClick={onClose}
                  >
                    Luxury Insights
                  </Link>
                  <Link
                    href="/contact"
                    className="block py-1 text-lg text-white hover:text-[#b3804c] transition-colors"
                    onClick={onClose}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabs View */}
            {activeMenu && (
              <div className={cn("mobile-container", getContainerClass("tabs"))}>
                <div className="p-6 mobile-view">
                  <div className="flex items-center justify-between border-b border-zinc-300/10 pb-4">
                    <button
                      onClick={() => navigateBackward("main")}
                      className="flex items-center text-[#b3804c] text-lg"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      <span>Back</span>
                    </button>
                    <p className="text-sm text-zinc-300/70 uppercase font-medium">
                      {navigationData[activeMenu]?.title}
                    </p>
                  </div>
                  <div className="mt-6 space-y-5">
                    {navigationData[activeMenu]?.tabs.map((tab) => (
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
                  <div className="mt-8">
                    <Link 
                      href={navigationData[activeMenu].href} 
                      className="flex items-center text-[#b3804c] text-lg"
                      onClick={onClose}
                    >
                      {getViewAllText(activeMenu)}{" "}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Content View */}
            {activeMenu && activeTab && (
              <div className={cn("mobile-container", getContainerClass("content"))}>
                <div className="p-6 mobile-view">
                  <div className="flex items-center justify-between border-b border-zinc-300/10 pb-4">
                    <button
                      onClick={() => navigateBackward("tabs")}
                      className="flex items-center text-[#b3804c] text-lg"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      <span>Back</span>
                    </button>
                    <p className="text-sm text-zinc-300/70 uppercase font-medium">{activeTab}</p>
                  </div>
                  <div className="mt-6 space-y-5">
                    {navigationData[activeMenu]?.content[activeTab]?.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block py-2 hover:bg-white/5 rounded-lg px-2 transition-all duration-200 mb-0"
                        onClick={onClose}
                      >
                        {item.label}
                        {/* {item.description && (
                          <span className="block text-sm text-gray-400">{item.description}</span>
                        )} */}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Link
                      href={navigationData[activeMenu].href}
                      className="flex items-center text-[#b3804c] text-lg font-medium gap-2"
                      onClick={onClose}
                    >
                      {getViewAllText(activeMenu)}
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}