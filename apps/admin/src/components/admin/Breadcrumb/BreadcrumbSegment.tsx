import React from 'react';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbSegmentProps, BREADCRUMB_CONFIG } from './BreadcrumbTypes';

export const BreadcrumbSegment: React.FC<BreadcrumbSegmentProps> = ({ 
  segment, 
  href, 
  isLast, 
  entityType,
  parentType,
  customBreadcrumbs
}) => {
  // Prvo proveravamo konfiguraciju za segment
  const config = BREADCRUMB_CONFIG[segment] || { 
    title: segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    isLinkable: true
  };

  if (config.skipInPath) {
    return null;
  }

  // Proveravamo da li je segment ID (hex string ili broj)
  const isId = Boolean(
    segment && (
      segment.match(/^[0-9]+$/) || // brojevi
      segment.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i) || // UUID format
      segment.match(/^[0-9a-f-]+$/i) // bilo koji hex string sa crticama
    )
  );
  
  // Ako je ID i imamo custom breadcrumb, koristimo ga
  if (isId && customBreadcrumbs[segment]) {
    return (
      <>
        <BreadcrumbItem>
          {isLast || !config.isLinkable ? (
            <BreadcrumbPage>{customBreadcrumbs[segment]}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>{customBreadcrumbs[segment]}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </>
    );
  }

  // Za specijalne slučajeve kada je "create" ili "edit" nakon ID-a
  const prevSegment = href.split('/').filter(Boolean).slice(-2)[0];
  const isPrevId = Boolean(
    prevSegment && (
      prevSegment.match(/^[0-9]+$/) || 
      prevSegment.match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i) || 
      prevSegment.match(/^[0-9a-f-]+$/i)
    )
  );

  // Ako je ID i nemamo custom breadcrumb, proveravamo da li tip entiteta ima detail stranicu
  if (isId) {
    // Pronalazimo prethodni segment koji bi trebao biti tip entiteta
    const pathParts = href.split('/').filter(Boolean);
    const segmentIndex = pathParts.findIndex(part => part === segment);
    const prevSegmentName = segmentIndex > 0 ? pathParts[segmentIndex - 1] : null;
    
    // Pokušavamo da nađemo konfiguraciju za tip entiteta
    let entityConfig = null;
    
    if (prevSegmentName && BREADCRUMB_CONFIG[prevSegmentName]) {
      entityConfig = BREADCRUMB_CONFIG[prevSegmentName];
    } else if (entityType) {
      entityConfig = BREADCRUMB_CONFIG[entityType];
    }
    
    // Ako entity nema detail stranicu, preskačemo ovaj segment
    if (entityConfig && entityConfig.hasDetailPage === false) {
      return null;
    }
    
    const genericTitle = entityConfig?.singleTitle 
      ? `${entityConfig.singleTitle} Details` 
      : 'Details';

    return (
      <>
        <BreadcrumbItem>
          {isLast || !config.isLinkable ? (
            <BreadcrumbPage>{genericTitle}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>{genericTitle}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </>
    );
  }

  // Posebna logika za "create" i "edit"
  if (segment === "create" || segment === "edit") {
    // Proveravamo da li je prethodni segment ID
    if (isPrevId) {
      // Pronalazimo tip entiteta iz segmenata puta
      const pathParts = href.split('/').filter(Boolean);
      const prevIdIndex = pathParts.findIndex(part => part === prevSegment);
      const entitySegment = prevIdIndex > 0 ? pathParts[prevIdIndex - 1] : null;
      
      const entityConfig = entitySegment ? BREADCRUMB_CONFIG[entitySegment] : null;
      
      // Ako entity nema detail stranicu, prilagođavamo naslov (na primer "Edit Amenity" umesto "Edit")
      const title = `${segment === "edit" ? "Edit" : "Create"} ${entityConfig?.singleTitle || "Item"}`;
      
      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </>
      );
    }
    
    // Za standardni create/edit
    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbPage>{config.title}</BreadcrumbPage>
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </>
    );
  }

  // Za standardne segmente koristimo konfiguraciju
  return (
    <>
      <BreadcrumbItem>
        {isLast || !config.isLinkable ? (
          <BreadcrumbPage>{config.title}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={href}>{config.title}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
      {!isLast && <BreadcrumbSeparator />}
    </>
  );
};