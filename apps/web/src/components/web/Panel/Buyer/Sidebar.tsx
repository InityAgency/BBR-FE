"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {Sparkles, UserPen, Heart, Shield, SlidersHorizontal, Bell, Lock} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
export default function BuyerSidebar() {
  const { user } = useAuth();
  return (
    <div className="w-full lg:w-1/5 bg-secondary px-4 py-8 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Welcome {user?.fullName}</h1>
        </div>
        <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Link href="/#" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed text-muted-foreground justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles width={20} height={20}/>
                    AI Matchmaking Tool
                  </div>
                <Lock width={16} height={16}/>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                This feature is currently in development.
              </TooltipContent>
            </Tooltip>
          <Link href="/buyer/personal-information" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <UserPen width={20} height={20}/>
            Personal Information
          </Link>
          <Link href="/buyer/favourites" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <Heart width={20} height={20}/>
            My Favourites
          </Link>
          <Link href="/buyer/preferences" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <SlidersHorizontal width={20} height={20}/>
            My Preferences
          </Link>
          <Link href="/buyer/security" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300">
            <Shield width={20} height={20}/>
            Security
          </Link>
          <Link href="/buyer/notifications" className="text-md font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-300 ">
            <Bell width={20} height={20}/>
            Notifications
          </Link>
        </div>
      </div>
    </div>
  )
}
