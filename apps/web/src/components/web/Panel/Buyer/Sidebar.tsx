"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {Sparkles, UserPen, Heart, Shield, SlidersHorizontal, Bell, Lock, Menu, X} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

export default function BuyerSidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-3 rounded-b-lg bg-secondary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
        <span className="text-sm font-medium">Panel Menu</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        top-0 left-0
        w-[280px] lg:w-1/5
        h-full lg:h-auto
        bg-secondary px-4 py-8 rounded-lg
        transform transition-transform duration-300 ease-in-out
        z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Welcome {user?.fullName}</h1>
          </div>
          <div className="flex flex-col gap-2">
          
            <Link 
              href="/buyer/ai-matchmaking-tool" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles width={20} height={20}/>
              AI Matchmaking Tool
            </Link>
            <Link 
              href="/buyer/personal-information" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <UserPen width={20} height={20}/>
              Personal Information
            </Link>
            <Link 
              href="/buyer/favourites" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Heart width={20} height={20}/>
              My Favourites
            </Link>
            <Link 
              href="/buyer/preferences" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <SlidersHorizontal width={20} height={20}/>
              My Preferences
            </Link>
            <Link 
              href="/buyer/security" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Shield width={20} height={20}/>
              Security
            </Link>
            <Link 
              href="/buyer/notifications" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Bell width={20} height={20}/>
              Notifications
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
