import DeveloperSidebar from "@/components/web/Panel/Developer/Sidebar";
import PanelLayout from "@/components/web/PanelLayout";

export default function DeveloperPanelLayout({ children }: { children: React.ReactNode }) {
  return (
      <PanelLayout className="w-full flex flex-col lg:flex-row w-full gap-4">
        <DeveloperSidebar />
        <div className="flex-1 w-full min-h-[50svh]">{children}</div>
      </PanelLayout>
  );
}