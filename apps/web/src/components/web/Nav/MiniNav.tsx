"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  User,
  LogOut,
  BellRing,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function MiniNav() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      sessionStorage.removeItem('bbr-session');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getDashboardUrl = () => {
    if (!user) return "/";

    if (user.role?.name === "developer") {
      return "/developer/dashboard";
    } else if (user.role?.name === "buyer") {
      return "/buyer/dashboard";
    }

    return "/";
  };

  return (
    <div className="w-full xl:max-w-[1600px] mx-auto px-4 py-2 justify-between items-center gap-2 md:gap-4 lg:gap-6 hidden sm:flex">
      <div className="flex flex-row gap-2 md:gap-4 lg:gap-6">
        <Link
          href="mailto:support@bestbrandedresidences.com"
          className="flex gap-1 md:gap-2 items-center hover:text-primary transition-all text-xs md:text-sm"
        >
          <Mail width={14} height={14} className="md:w-4 md:h-4" color="#B3804C" />
          <span className="hidden lg:inline">support@bestbrandedresidences.com</span>
          <span className="lg:hidden">support@bbr.com</span>
        </Link>
        <Link
          href="tel:800-874-2458"
          className="flex gap-1 md:gap-2 items-center hover:text-primary transition-all text-xs md:text-sm"
        >
          <Phone width={14} height={14} className="md:w-4 md:h-4" color="#B3804C" />
          <span className="hidden md:inline">800-874-2458</span>
          <span className="md:hidden">800-874-2458</span>
        </Link>
      </div>
      <div className="flex flex-row gap-2 md:gap-4 lg:gap-6 items-center">
        <Link href="/schedule-a-demo" className="hover:text-primary transition-all text-xs md:text-sm hidden lg:inline">
          Schedule a demo
        </Link>
        <Link
          href="/developer-solutions"
          className="hover:text-primary transition-all text-xs md:text-sm hidden lg:inline"
        >
          Developer features
        </Link>
        <Link
          href="/marketing-solutions"
          className="hover:text-primary transition-all text-xs md:text-sm hidden lg:inline"
        >
          Marketing solutions
        </Link>
        <div className="flex flex-col sm:flex-row gap-2 relative">
          {user ? (
            <div className="relative">
              <div
                className="flex items-center gap-1 md:gap-2 cursor-pointer py-1 md:py-2 px-2 md:px-3 rounded-md hover:secondary dark:hover:bg-secondary transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Avatar className="h-6 w-6 md:h-8 md:w-8">
                  <AvatarImage
                    src={
                      user.role?.name === 'developer'
                        ? user.company?.image?.id
                          ? `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${user.company?.image?.id}/content`
                          : ""
                        : user.buyer?.image_id
                          ? `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${user.buyer?.image_id}/content`
                          : ""
                    }
                    alt={user.fullName}
                  />
                  <AvatarFallback className="text-xs md:text-sm">{getInitials(user.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col hidden lg:flex">
                  <span className="text-xs md:text-sm font-medium truncate max-w-[100px] lg:max-w-[120px]">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[100px] lg:max-w-[120px] capitalize">
                    {user.role?.name}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 md:w-56 bg-secondary rounded-md shadow-lg z-50 border border-border overflow-hidden"
                >
                  <div className="p-3 md:p-4 border-b border-border">
                    <p className="font-medium text-xs md:text-sm">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={getDashboardUrl()}
                      className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 text-xs md:text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-3 w-3 md:h-4 md:w-4" />
                      My Dashboard
                    </Link>
                    {/* <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <BellRing className="h-4 w-4" />
                      Notifications
                    </Link> */}
                    <Link
                      href={user.role?.name === 'developer' ? '/developer/settings' : '/buyer/personal-information'}
                      className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 text-xs md:text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-3 w-3 md:h-4 md:w-4" />
                      Account Settings
                    </Link>
                    {/* <Link
                      href="/help-support"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Link> */}
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 text-xs md:text-sm text-destructive hover:bg-white/5 w-full text-left transition-colors"
                    >
                      <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="secondary" size="sm" className="text-xs md:text-sm h-8 md:h-10" asChild>
                <Link href="/register">Join</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs md:text-sm h-8 md:h-10"
                asChild
              >
                <Link href="/login">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                  <span>Login</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
