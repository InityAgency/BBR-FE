"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

interface Section {
  id: string;
  name: string;
  disabled?: boolean;
  tooltip?: string;
}

interface StickyScrollTabsProps {
  sections: Section[];
  offset?: number; // Pixel offset for scroll position
}

export function StickyScrollTabs({ sections, offset = 100 }: StickyScrollTabsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Funkcija za skrolovanje do određene sekcije
  const scrollToSection = (sectionId: string, disabled?: boolean) => {
    if (disabled) return; // Ako je sekcija onemogućena, ne radimo ništa
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Dodati hash u URL bez osvežavanja stranice
      window.history.pushState({}, "", `${pathname}#${sectionId}`);
      
      // Skrolovanje do sekcije sa animacijom
      const topPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      
      setActiveSection(sectionId);
    }
  };

  // Pratimo skrolovanje i ažuriramo aktivnu sekciju
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 50; // Dodajte malo više za bolju detekciju

      // Pronađite trenutno vidljivu sekciju
      for (let i = 0; i < sections.length; i++) {
        // Preskačemo onemogućene sekcije pri detekciji skrolovanja
        if (sections[i].disabled) continue;
        
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    // Proverimo hash u URL-u prilikom učitavanja stranice
    const checkURLHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && sections.some(section => section.id === hash && !section.disabled)) {
        setTimeout(() => {
          scrollToSection(hash);
        }, 500); // Malo odložimo da osiguramo da je DOM učitan
      } else if (sections.length > 0) {
        // Ako nema hash-a, postavimo prvi dostupni tab kao aktivan
        const firstEnabledSection = sections.find(section => !section.disabled);
        if (firstEnabledSection) {
          setActiveSection(firstEnabledSection.id);
        }
      }
    };

    checkURLHash();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections, offset, pathname]);

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border w-full lg:-mt-8">
      <div className="flex gap-2 flex-wrap w-full mx-auto">
        {sections.map((section) => {
          // Za onemogućene sekcije prikazujemo poseban stil sa ikonom katanca
          if (section.disabled) {
            return (
              <TooltipProvider key={section.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      className="disabled-tab uppercase flex items-center gap-1 cursor-not-allowed opacity-70"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Lock className="w-3 h-3 ml-1" />
                      {section.name}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{section.tooltip || "Coming soon"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          
          // Za obične sekcije standardni prikaz
          return (
            <a
              key={section.id}
              className={
                activeSection === section.id
                  ? "active-tab uppercase"
                  : "classic-tab uppercase"
              }
              onClick={() => scrollToSection(section.id, section.disabled)}
            >
              {section.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}