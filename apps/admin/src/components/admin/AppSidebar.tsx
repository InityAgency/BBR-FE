"use client"

import * as React from "react"
import Image from "next/image"
import {
  LayoutPanelLeft,
  Building2,
  Award,
  UsersRound,
  Sparkle,
  Star,
  Contact,
} from "lucide-react"

import { NavMain } from "@/components/admin/SidebarContent/NavMain"
import { NavUser } from "@/components/admin/SidebarContent/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { brandsData } from "@/app/data/brands"
import { residencesData } from "@/app/data/residences"
// Brojanje brendova sa statusom "Pending"
const pendingBrandsCount = brandsData.filter(brand => brand.status === "Pending").length;
const pendingResidencesCount = residencesData.filter(residence => residence.status === "Pending").length;

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutPanelLeft,
  },
  {
    title: "Residences",
    url: "/residences",
    icon: Building2,
    items: [
      {
        title: "Pending Activations",
        url: "/residences?status=Pending",
        badge: pendingResidencesCount,
      },
      {
        title: "Claim Requests",
        url: "/residences/claim-requests",
      },
      {
        title: "Units Management",
        url: "/residences/units",
      },
    ],
  },
  {
    title: "Rankings",
    url: "/rankings",
    icon: Award,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Contact,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: Star,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: Sparkle,
    items: [
      {
        title: "Pending Activations",
        url: "/brands?status=Pending",
        badge: pendingBrandsCount,
      }
    ]
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: UsersRound,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  
  // Default user data to fall back on if auth context user is not available
  const userData = {
    name: user?.fullName || "BBR Admin",
    email: user?.email || "admin@example.com",
    avatar: user?.avatar || "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
              <a href="/dashboard">
                <Image src="/light-logo.svg" alt="Logo" width={85} height={36} />
              </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}