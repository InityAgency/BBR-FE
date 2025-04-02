import React, { useState } from 'react';
import { usePathname } from "next/navigation";
import {
  Breadcrumb as UiBreadcrumb,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { BreadcrumbContext } from './BreadcrumbContext';
import { BreadcrumbSegment } from './BreadcrumbSegment';
import { BREADCRUMB_CONFIG } from './BreadcrumbTypes';

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<Record<string, string>>({});

  const setCustomBreadcrumb = (segment: string, title: string) => {
    setCustomBreadcrumbs(prev => ({ ...prev, [segment]: title }));
  };

  const resetCustomBreadcrumb = (segment: string) => {
    setCustomBreadcrumbs(prev => {
      const updated = { ...prev };
      delete updated[segment];
      return updated;
    });
  };

  const getEntityType = (): string | null => {
    // Pronalazimo prvi segment koji je definisan kao entitet
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const config = BREADCRUMB_CONFIG[segment];
      
      if (config && config.singleTitle) {
        return segment;
      }
    }
    return null;
  };

  const getParentType = (): string | null => {
    // Pronalazimo prvi segment koji je definisan kao parent
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const config = BREADCRUMB_CONFIG[segment];
      
      if (config && config.isParent) {
        return segment;
      }
    }
    return null;
  };

  const entityType = getEntityType();
  const parentType = getParentType();

  return (
    <BreadcrumbContext.Provider value={{ setCustomBreadcrumb, resetCustomBreadcrumb }}>
      <UiBreadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            const isLast = index === pathSegments.length - 1;
            
            return (
              <BreadcrumbSegment 
                key={href}
                segment={segment} 
                href={href} 
                isLast={isLast}
                entityType={entityType}
                parentType={parentType}
                customBreadcrumbs={customBreadcrumbs}
              />
            );
          })}
        </BreadcrumbList>
      </UiBreadcrumb>
    </BreadcrumbContext.Provider>
  );
};