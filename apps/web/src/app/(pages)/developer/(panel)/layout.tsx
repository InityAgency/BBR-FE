import DeveloperSidebar from "@/components/web/Panel/Developer/Sidebar";

export default function DeveloperPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
        <DeveloperSidebar />
        <div className="flex-1">{children}</div>
    </div>  
  );
}