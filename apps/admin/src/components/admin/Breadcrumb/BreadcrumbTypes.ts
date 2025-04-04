export type BreadcrumbConfig = {
  title: string;
  skipInPath?: boolean;
  isLinkable?: boolean;
  hideDetails?: boolean;
  singleTitle?: string;
  parent?: string;
  isParent?: boolean;
  hasDetailPage?: boolean;
};

export interface BreadcrumbContextType {
  setCustomBreadcrumb: (segment: string, title: string) => void;
  resetCustomBreadcrumb: (segment: string) => void;
}

export interface BreadcrumbSegmentProps {
  segment: string;
  href: string;
  isLast: boolean;
  entityType: string | null;
  parentType: string | null;
  customBreadcrumbs: Record<string, string>;
}

export const BREADCRUMB_CONFIG: Record<string, BreadcrumbConfig> = {
  admin: { title: "Admin", skipInPath: true },
  dashboard: { title: "Dashboard", isLinkable: true },
  residences: { 
    title: "Residences", 
    isLinkable: true,
    isParent: true,
    hasDetailPage: false
  },
  amenities: { 
    title: "Amenities", 
    isLinkable: true,
    parent: "residences",
    singleTitle: "Amenity",
    hasDetailPage: false
  },
  lifestyle: { 
    title: "Lifestyle", 
    isLinkable: true,
    parent: "residences",
    singleTitle: "Lifestyle",
    hasDetailPage: false
  },
  brands: { 
    title: "Brands", 
    isLinkable: true,
    isParent: true,
    singleTitle: "Brand",
    hasDetailPage: true
  },
  types: { 
    title: "Brand Types", 
    isLinkable: true,
    parent: "brands",
    singleTitle: "Brand Type",
    hasDetailPage: false
  },
  "ranking-category-types": {
    title: "Ranking Category Types",
    isLinkable: true,
    parent: "rankings",
    singleTitle: "Ranking Category Type",
    hasDetailPage: false
  },
  "user-management": { 
    title: "User Management", 
    isLinkable: true,
    singleTitle: "User",
    hasDetailPage: true
  },
  create: { 
    title: "Create", 
    isLinkable: false 
  },
  edit: { 
    title: "Edit", 
    isLinkable: false 
  }
};