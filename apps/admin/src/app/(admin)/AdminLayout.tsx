"use client";
import React from "react";
import { ReactNode } from "react";
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
  if (segment === "create" && index > 0) {
    const parentSegment = pathSegments[index - 1]; 
    return createTitles[parentSegment] || `Add New ${breadcrumbTitles[parentSegment] || parentSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}`;
  }

  return breadcrumbTitles[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

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
                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;
                  const formattedSegment = formatBreadcrumb(segment, index, pathSegments);

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
