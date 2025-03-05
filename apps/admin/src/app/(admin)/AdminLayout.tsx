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

interface AuthLayoutProps {
  children: ReactNode;
}

const breadcrumbTitles: Record<string, string> = {
  dashboard: "Dashboard",
  residences: "Residences",
  create: "Add New Residence",
  pending: "Pending Activations",
  brands: "Brands",
  "user-management": "User Management",
};

const formatBreadcrumb = (segment: string) => {
  return breadcrumbTitles[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;
                  const formattedSegment = formatBreadcrumb(segment);

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