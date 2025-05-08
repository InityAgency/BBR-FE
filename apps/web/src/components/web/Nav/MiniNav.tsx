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
  const { user, isLoading, logout } = useAuth();
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
    <div className="max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 py-2 justify-between items-center gap-6 hidden md:flex">
      <div className="flex flex-row gap-6">
        <Link
          href="mailto:support@bestbrandedresidence.com"
          className="flex gap-2 items-center hover:text-primary transition-all"
        >
          <Mail width={16} height={16} color="#B3804C" />
          support@bestbrandedresidence.com
        </Link>
        <Link
          href="tel:+1 223 664 5599"
          className="flex gap-2 items-center hover:text-primary transition-all"
        >
          <Phone width={16} height={16} color="#B3804C" />
          +1 223 664 5599
        </Link>
      </div>
      <div className="flex flex-row gap-6 items-center">
        <Link href="/" className="hover:text-primary transition-all">
          Schedule a demo
        </Link>
        <Link href="/" className="hover:text-primary transition-all">
          Developer features
        </Link>
        <Link
          href="/marketing-solutions"
          className="hover:text-primary transition-all"
        >
          Marketing solutions
        </Link>
        <Link
          href="/developer-solutions"
          className="hover:text-primary transition-all"
        >
          Developer solutions
        </Link>
        <div className="flex flex-col sm:flex-row gap-2 relative">
          {user ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:secondary dark:hover:bg-secondary transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.company?.image_id || ""}
                    alt={user.fullName}
                  />
                  <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role?.name}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-secondary rounded-md shadow-lg z-50 border border-border overflow-hidden"
                >
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-sm">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={getDashboardUrl()}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      My Dashboard
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <BellRing className="h-4 w-4" />
                      Notifications
                    </Link>
                    <Link
                      href="/account-settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </Link>
                    <Link
                      href="/help-support"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-white/5 w-full text-left transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="secondary" asChild>
                <Link href="/register">Join</Link>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                asChild
              >
                <Link href="/login">
                  <User className="h-4 w-4" />
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
