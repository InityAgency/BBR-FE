"use client"

import * as React from "react"
import Image from "next/image"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  LayoutPanelLeft,
  Building2,
  Award,
  UsersRound,
  Sparkle,
} from "lucide-react"

import { NavMain } from "@/components/admin/SidebarContent/NavMain"
import { NavUser } from "@/components/admin/SidebarContent/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { title } from "process"

const data = {
  user: {
    name: "BBR Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutPanelLeft,
      isActive: true,
    },
    {
      title: "Residences",
      url: "/residences",
      icon: Building2,
      items: [
        {
          title: "Pending Activations",
          url: "/residences/pending",
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
      title: "Brands",
      url: "/brands",
      icon: Sparkle,
      items: [
        {
          title: "Pending Activations",
          url: "/brands/pending",
        }
      ]
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: UsersRound,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
