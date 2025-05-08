"use client";
import { useState } from "react";
import clsx from "clsx";

const HorizontalTabs = ({
  tabs,
}: {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}) => {
  const [selectedTab, setSelectedTab] = useState("tab1");

  const activeTabClasses = "bg-[#B3804C] text-white rounded-lg";
  const inactiveTabClasses = "text-gray-700 hover:bg-gray-200";

  return (
    <div className="flex w-full flex-col md:flex-row p-4 gap-4">
      <div className="flex flex-1/4 flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={clsx(
              "px-4 py-2 text-left w-full md:w-auto",
              tab.id === selectedTab ? activeTabClasses : inactiveTabClasses
            )}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 flex-3/4">
        {tabs.find((tab) => tab.id === selectedTab)?.content}
      </div>
    </div>
  );
};

export default HorizontalTabs;
