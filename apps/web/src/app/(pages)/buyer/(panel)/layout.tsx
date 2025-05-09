import BuyerSidebar from "@/components/web/Panel/Buyer/Sidebar";

export default function BuyerPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
      <BuyerSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}