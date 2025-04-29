"use client";
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Zoom } from 'swiper/modules';

// Importujte CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

// Definišemo tip za slike
interface MediaImage {
  id: string;
  originalFileName?: string;
  mimeType?: string;
  uploadStatus?: string;
  size?: number;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: MediaImage[];
  initialSlide?: number;
  getMediaUrl: (id: string) => string;
  title: string;
}

export default function GalleryModal({ 
  isOpen, 
  onClose, 
  images, 
  initialSlide = 0,
  getMediaUrl,
  title
}: GalleryModalProps) {
  const [loaded, setLoaded] = useState(false);

  // Zatvaranje na Escape taster
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Sprečava scroll pozadine
      setLoaded(true);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Vraća scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="w-full h-full flex flex-col">
        {/* Header sa naslovom i dugmetom za zatvaranje */}
        <div className="p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Swiper galerija */}
        <div className="flex-1 w-full h-full">
          {loaded && images.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination, Keyboard, Zoom]}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              zoom={{ maxRatio: 3 }}
              initialSlide={initialSlide}
              loop={true}
              className="w-full h-full"
            >
              {images.map((image) => (
                <SwiperSlide key={image.id} className="flex items-center justify-center">
                  <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                    <img
                      src={getMediaUrl(image.id)}
                      alt={image.originalFileName || "Gallery image"}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        
        {/* Counter */}
        <div className="p-4 text-center text-white">
          <span className="text-sm opacity-80">
            {initialSlide + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}