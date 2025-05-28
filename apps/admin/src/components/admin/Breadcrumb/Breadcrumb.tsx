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

  // Nova funkcija za generisanje specijalnih href-ova
  const generateSpecialHref = (segment: string, index: number): string | null => {
    const config = BREADCRUMB_CONFIG[segment];
    
    // Specijalna logika za units - treba da vodi na residence sa inventory tab
    if (segment === 'units' && config?.parent === 'residences') {
      // Pronađi residence ID iz path segments
      const residenceIndex = pathSegments.findIndex(s => s === 'residences');
      if (residenceIndex !== -1 && residenceIndex + 1 < pathSegments.length) {
        const residenceId = pathSegments[residenceIndex + 1];
        return `/residences/${residenceId}?tab=inventory`;
      }
    }
    
    // Ovde možete dodati logiku za druge specijalne slučajeve
    // Na primer, za amenities koje takođe spadaju pod residences:
    if (segment === 'amenities' && config?.parent === 'residences') {
      const residenceIndex = pathSegments.findIndex(s => s === 'residences');
      if (residenceIndex !== -1 && residenceIndex + 1 < pathSegments.length) {
        const residenceId = pathSegments[residenceIndex + 1];
        return `/residences/${residenceId}?tab=amenities`; // ili koji god tab koristite
      }
    }
    
    return null; // Vraća null ako nema specijalne logike
  };

  const entityType = getEntityType();
  const parentType = getParentType();

  return (
    <BreadcrumbContext.Provider value={{ setCustomBreadcrumb, resetCustomBreadcrumb }}>
      <UiBreadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            // Pokušaj da generiše specijalni href
            const specialHref = generateSpecialHref(segment, index);
            
            // Koristi specijalni href ili standardni
            const href = specialHref || ("/" + pathSegments.slice(0, index + 1).join("/"));
            const isLast = index === pathSegments.length - 1;
            
            return (
              <BreadcrumbSegment 
                key={`${segment}-${index}`} // Promenjen key da bude jedinstven
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