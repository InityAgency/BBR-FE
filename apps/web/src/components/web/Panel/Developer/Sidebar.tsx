"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {Proportions, Building, BookUser, MessageSquareDiff, Trophy, CreditCard, ToyBrick, BadgeCheck, CircleUser, Menu, X} from "lucide-react";
import { useState } from "react";

export default function DeveloperSidebar() {
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
        bg-secondary px-4 py-8 rounded-lg min-h-[50svh]
        transform transition-transform duration-300 ease-in-out
        z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Welcome {user?.fullName}</h1>
          </div>
          <div className="flex flex-col gap-2">
            <Link 
              href="/developer/dashboard" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Proportions width={20} height={20}/>
              Dashboard
            </Link>
            <Link 
              href="/developer/residences" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Building width={20} height={20}/>
              Residence Management
            </Link>
            <Link 
              href="/developer/leads" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <BookUser width={20} height={20}/>
              Leads Management
            </Link>
            <Link 
              href="/developer/ranking" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <Trophy width={20} height={20}/>
              Ranking Management
            </Link>
            <Link 
              href="/developer/reviews" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <MessageSquareDiff width={20} height={20}/>
              Review Management
            </Link>
            <Link 
              href="/developer/billing" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard width={20} height={20}/>
              Billing
            </Link>
            <Link 
              href="/developer/marketing" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <ToyBrick width={20} height={20}/>
              Marketing Add-ons
            </Link>
            <Link 
              href="/developer/settings" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <CircleUser width={20} height={20}/>
              Account Settings
            </Link>
            <Link 
              href="/developer/marketing-collateral" 
              className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <BadgeCheck width={20} height={20}/>
              Marketing Collateral
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
