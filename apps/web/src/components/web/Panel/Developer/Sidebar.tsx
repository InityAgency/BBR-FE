"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {Proportions, Building, BookUser, MessageSquareDiff, Trophy, CreditCard, ToyBrick, BadgeCheck} from "lucide-react";
export default function DeveloperSidebar() {
  const { user } = useAuth();
  return (
    <div className="w-full lg:w-1/5 bg-secondary px-4 py-8 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Welcome {user?.fullName}</h1>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/developer/dashboard" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <Proportions width={20} height={20}/>
            Dashboard
          </Link>
          <Link href="/developer/residences" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <Building width={20} height={20}/>
            Residence Management
          </Link>
          <Link href="/developer/leads" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <BookUser width={20} height={20}/>
            Leads Management
          </Link>
          <Link href="/developer/ranking" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <Trophy width={20} height={20}/>
            Ranking Management
          </Link>
          <Link href="/developer/reviews" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <MessageSquareDiff width={20} height={20}/>
            Review Management
          </Link>
          <Link href="/developer/billing" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300 ">
            <CreditCard width={20} height={20}/>
            Billing
          </Link>
          <Link href="/developer/marketing" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <ToyBrick width={20} height={20}/>
            Marketing Add-ons
          </Link>
          <Link href="/developer/marketing-collateral" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <BadgeCheck width={20} height={20}/>
            Marketing Collateral
          </Link>
        </div>
      </div>
    </div>
  )
}
