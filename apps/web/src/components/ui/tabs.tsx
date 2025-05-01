import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
import clsx from "clsx"; // koristi ako želiš da kombinuješ klase bez problema

type TabItem = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type CustomTabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string; // <- dodat prop
};

const tabClasses =
  "px-4 py-2 border-b-2 transition-colors duration-200 border-transparent text-gray-500 data-[state=active]:border-primary data-[state=active]:text-primary whitespace-nowrap";

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue,
  className,
}) => {
  return (
    <Tabs.Root
      defaultValue={defaultValue || tabs[0]?.value}
      className={clsx("w-full", className)}
    >
      <Tabs.List className="flex flex-wrap border-b border-primary justify-between overflow-x-auto whitespace-nowrap">
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

      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="p-4">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default CustomTabs;
