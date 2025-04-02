import React from 'react';
import { BreadcrumbContextType } from './BreadcrumbTypes';

export const BreadcrumbContext = React.createContext<BreadcrumbContextType>({
  setCustomBreadcrumb: () => {},
  resetCustomBreadcrumb: () => {},
});

export const useBreadcrumb = () => React.useContext(BreadcrumbContext); 