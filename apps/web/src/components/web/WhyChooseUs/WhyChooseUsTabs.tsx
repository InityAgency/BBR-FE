"use client";
import * as Tabs from "@radix-ui/react-tabs";
import React, { useRef, useState, useEffect } from "react";
import clsx from "clsx";

type TabItem = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type CustomTabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
};

const tabClasses =
  "px-4 py-2 border-b-2 transition-colors duration-200 border-transparent text-gray-500 data-[state=active]:border-primary data-[state=active]:text-primary whitespace-nowrap";

const WhyChooseUsTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScrollInterval, setAutoScrollInterval] = useState<NodeJS.Timeout | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }
  };

  const startAutoScroll = (direction: 'left' | 'right') => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const scrollAmount = direction === 'left' ? -10 : 10;
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }, 20);
    
    setAutoScrollInterval(interval);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }
  };

  useEffect(() => {
    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [autoScrollInterval]);

  return (
    <Tabs.Root
      defaultValue={defaultValue || tabs[0]?.value}
      className={clsx("w-full", className)}
    >
      <div className="relative scroll-tabs">
        <Tabs.List 
          ref={scrollRef}
          className="flex border-b border-primary justify-between overflow-x-auto cursor-grab active:cursor-grabbing hide-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={tabClasses}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div 
          className="absolute left-0 top-0 bottom-0 w-8 hover:bg-gradient-to-r from-white/50 to-transparent cursor-pointer"
          onMouseEnter={() => startAutoScroll('right')}
          onMouseLeave={stopAutoScroll}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-8 hover:bg-gradient-to-l from-white/50 to-transparent cursor-pointer"
          onMouseEnter={() => startAutoScroll('left')}
          onMouseLeave={stopAutoScroll}
        />
      </div>

      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="p-4">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default WhyChooseUsTabs;
