"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationData } from "./navigation-data"

type NavigationData = typeof navigationData;

interface MegaMenuContentProps {
  activeMenu: string
  activeTab: string
  setActiveTab: (tab: string) => void
  navigationData: NavigationData
}

export function MegaMenuContent({ 
  activeMenu, 
  activeTab, 
  setActiveTab,
  navigationData 
}: MegaMenuContentProps) {
  const menuData = navigationData[activeMenu]

  if (!menuData) return null

  const tabContent = menuData.content[activeTab] || []

  // Funkcija za prikazivanje linka "View all"
  const getViewAllText = () => {
    switch (activeMenu) {
      case "allBrands":
        return "View all Brands"
      case "bestResidences":
        return "View all Best Residences"
      case "allResidences":
      default:
        return "View all Residences"
    }
  }

  return (
    <div className="flex flex-row">
      {/* Tabs sidebar */}
      <div className="w-1/5 p-4 border-r border-white/10 bg-secondary">
        {menuData.tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "block w-full text-left p-3 rounded-lg transition-all duration-200",
              activeTab === tab
                ? "text-[#b3804c] font-medium translate-x-1"
                : "hover:text-[#b3804c] hover:translate-x-1",
            )}
          >
            {tab}
          </button>
        ))}

        {/* View all link at bottom */}
        <Link
          href={menuData.href}
          className="flex items-center text-[#b3804c] mt-8 p-3 hover:translate-x-1 transition-all duration-200"
        >
          {getViewAllText()} <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {/* Content area */}
      <div className="w-4/5 p-8 bg-secondary">
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 animate-fade-in">
          {tabContent.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-white hover:text-[#b3804c] transition-all duration-200 hover:translate-x-1"
            >
              {item.label}
              {/* {item.description && (
                <span className="block text-sm text-gray-400">{item.description}</span>
              )} */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}