// Dodajte ovaj fajl u src/types folder ili u root direktorijum
declare module 'swiper/modules' {
    export const Navigation: any;
    export const Pagination: any;
    export const Keyboard: any;
    export const Zoom: any;
  }
  
  declare module 'swiper/react' {
    import React from 'react';
    import { SwiperOptions } from 'swiper/types';
    
    export interface SwiperProps extends SwiperOptions {
      children?: React.ReactNode;
      className?: string;
    }
    
    export const Swiper: React.FunctionComponent<SwiperProps>;
    export const SwiperSlide: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>>;
  }