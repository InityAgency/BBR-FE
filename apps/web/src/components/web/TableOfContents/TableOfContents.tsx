"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
  maxDepth?: number;
  className?: string;
  title?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  contentSelector = '.prose',
  maxDepth = 2,
  className = '',
  title = 'Table of Contents'
}) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    // Find all heading elements up to the specified maxDepth
    const headingElements: HTMLHeadingElement[] = [];
    for (let i = 1; i <= maxDepth; i++) {
      const elements = contentElement.querySelectorAll(`h${i}`);
      elements.forEach(el => headingElements.push(el as HTMLHeadingElement));
    }

    // Sort headings by their position in the document
    headingElements.sort((a, b) => {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });

    // Process headings to create TOC items
    const items = headingElements.map(heading => {
      // Generate an ID if the heading doesn't have one
      if (!heading.id) {
        heading.id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `heading-${Math.random().toString(36).substring(2, 9)}`;
      }

      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });

    setHeadings(items);
  }, [contentSelector, maxDepth]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentActiveId = null;

      // Reverzni redosled za pretraživanje odozdo na gore za bolje određivanje
      // trenutnog aktivnog naslova tokom skrolovanja
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveId = heading.id;
          break;
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    // Inicijalno pokretanje za postavljanje aktivnog naslova bez skrolovanja
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-8 self-start w-[35svw] max-h-[calc(100vh-4rem)] overflow-y-auto pr-4 pb-24 hidden md:block">
      <nav className="toc-nav">
        <ul className="space-y-0">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`relative pl-4 transition-colors text-base py-2`}
              style={{
                marginLeft: `${(heading.level - 1) * 0.75}rem`,
              }}
            >
              {/* Vertikalna traka koja označava aktivni naslov */}
              <div 
                className={`absolute left-0 top-0 w-0.5 h-full rounded-full transition-colors ${
                  activeId === heading.id ? 'bg-primary' : 'bg-zinc-700'
                }`}
              />
              <a
                href={`#${heading.id}`}
                className={`block py-1 ${
                  activeId === heading.id 
                    ? 'text-white font-medium' 
                    : 'text-muted-foreground hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    const headerOffset = 80; // Podesi ovu vrednost prema visini svog headera
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;