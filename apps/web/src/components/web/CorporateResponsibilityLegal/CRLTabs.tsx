import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
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
  "py-4 px-4 border-l-2 text-left transition-colors duration-200 border-transparent text-gray-500 data-[state=active]:border-primary data-[state=inactive]:border-[#F1E8DF] data-[state=active]:text-primary whitespace-nowrap";

const CRLTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue,
  className,
}) => {
  return (
    <Tabs.Root
      defaultValue={defaultValue || tabs[0]?.value}
      className={clsx(
        "flex gap-4 place-self-start flex-col lg:flex-row",
        className
      )}
    >
      <Tabs.List className="flex flex-col">
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

export default CRLTabs;
