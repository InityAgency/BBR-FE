"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MegaMenuContent } from "./mega-menu-content"
import { MobileMegaMenu } from "./mobile-mega-menu"
import { navigationData } from "./navigation-data"

// Tip animacije za mobilni meni
type MobileMenuAnimation = "slide-right" | "slide-down"

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("")
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Možete promeniti tip animacije ovde - "slide-right" ili "slide-down"
  const [mobileMenuAnimation] = useState<MobileMenuAnimation>("slide-right")

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close menu on route change
  useEffect(() => {
    setActiveMenu(null)
    setIsMobileMenuOpen(false)
  }, [])

  // Funkcije za hover
  const handleMouseEnter = (menuName: string) => {
    setActiveMenu(menuName)
    // Set the first tab as active by default
    const firstTab = navigationData[menuName]?.tabs[0] || ""
    setActiveTab(firstTab)
  }

  const handleMouseLeave = () => {
    setActiveMenu(null)
  }

  return (
    <div ref={menuRef} className="relative" onMouseLeave={handleMouseLeave}>
      {/* Main navigation bar */}
      <div className="max-w-[calc(100vw-1.5rem)] 2xl:max-w-[calc(100vw-4rem)] mx-auto px-8 py-6 bg-secondary rounded-t-lg mt-2">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex w-full lg:w-auto justify-between items-center">
            <Link href="/">
              <Image src="/logo-horizontal.svg" alt="Logo" width={100} height={40} className="h-10 w-auto" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-row gap-8 items-center">
            {Object.keys(navigationData).map((menuName) => (
              <div key={menuName} className="relative group" onMouseEnter={() => handleMouseEnter(menuName)}>
                <Link
                  href={navigationData[menuName].href}
                  className={cn(
                    "flex flex-row gap-1 items-center cursor-pointer",
                    activeMenu === menuName ? "text-[#b3804c] font-medium" : "text-white",
                  )}
                >
                  {navigationData[menuName].title}
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", activeMenu === menuName ? "rotate-180" : "")}
                  />
                </Link>
              </div>
            ))}
            <Link href="/criteria" className="text-white hover:text-[#b3804c] transition-colors">
              Evaluation Criteria
            </Link>
            <Link href="/deals" className="text-white hover:text-[#b3804c] transition-colors">
              Exclusive Deals
            </Link>
            <Link href="/blog" className="text-white hover:text-[#b3804c] transition-colors">
              Luxury Insights
            </Link>
          </div>

          <div className="hidden lg:flex">
            <Button asChild variant="outline" className="bg-white/5 hover:bg-white/10 text-white border-[#b3804c]">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMegaMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        animationType={mobileMenuAnimation}
      />

      {/* Mega Menu - Desktop */}
      {activeMenu && (
        <div className="max-w-[calc(100vw-1.5rem)] 2xl:max-w-[calc(100vw-7rem)] rounded-lg border border-[#161D22] mx-auto absolute left-0 right-0 bg-[#161D22] rounded-b-lg text-white shadow-xl z-50 hidden lg:block animate-fade-in-down overflow-hidden">
          <MegaMenuContent activeMenu={activeMenu} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  )
}
