"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/admin/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { brandsData } from "@/app/data/brands";
import { Brand } from "@/app/types/models/Brand";

interface AdminLayoutProps {
  children: ReactNode;
}

const breadcrumbTitles: Record<string, string> = {
  dashboard: "Dashboard",
  residences: "Residences",
  pending: "Pending Activations",
  brands: "Brands",
  "user-management": "User Management",
};

const createTitles: Record<string, string> = {
  residences: "Add New Residence",
  brands: "Add New Brand",
  "user-management": "Add New User",
};

const formatBreadcrumb = (segment: string, index: number, pathSegments: string[]) => {
  // Handle create pages
  if (segment === "create" && index > 0) {
    const parentSegment = pathSegments[index - 1]; 
    return createTitles[parentSegment] || `Add New ${breadcrumbTitles[parentSegment] || parentSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}`;
  }

  // Handle edit pages for brands
  if (segment === "edit" && pathSegments[index - 2] === "brands") {
    const brandId = pathSegments[index - 1];
    const brand = brandsData.find((b: Brand) => b.id === brandId);
    return brand ? `Edit ${brand.name}` : "Edit Brand";
  }

  // Handle edit pages for users
  if (segment === "edit" && pathSegments[index - 2] === "user-management") {
    return "Edit User";
  }

  // Handle brand IDs in the path
  if (index > 0 && pathSegments[index - 1] === "brands" && segment.match(/^\d+$/)) {
    const brand = brandsData.find((b: Brand) => b.id === segment);
    return brand ? brand.name : segment;
  }

  // Handle user IDs in the path
  if (index > 0 && pathSegments[index - 1] === "user-management" && segment.match(/[0-9a-f-]+$/i)) {
    return "User";
  }

  return breadcrumbTitles[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Funkcija koja određuje da li segment treba da se prikaže u breadcrumb-u
  const shouldShowSegment = (segment: string, index: number, segments: string[]) => {
    // Ako smo na putanji za uređivanje korisnika, sakrijemo srednji segment (userId)
    if (segments[index + 1] === "edit" && segments[index - 1] === "user-management") {
      return false;
    }
    
    return true;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical"/>
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments
                  .filter((segment, index) => shouldShowSegment(segment, index, pathSegments))
                  .map((segment, index, filteredSegments) => {
                    // Računamo originalnu putanju do ovog segmenta
                    // Za svaki filtrirani segment, moramo naći njegovu originalnu poziciju
                    let originalIndex = 0;
                    for (let i = 0; i <= index; i++) {
                      originalIndex = pathSegments.indexOf(filteredSegments[i], originalIndex) + 1;
                    }
                    const href = "/" + pathSegments.slice(0, originalIndex).join("/");
                    
                    const isLast = index === filteredSegments.length - 1;
                    const formattedSegment = formatBreadcrumb(segment, pathSegments.indexOf(segment), pathSegments);

                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
