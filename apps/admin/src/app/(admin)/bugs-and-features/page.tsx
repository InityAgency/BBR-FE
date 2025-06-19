import AdminLayout from "../AdminLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeaturesTab, BugsTab } from "@/components/admin/BugsAndFeatures";

export default function BugsAndFeatures() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Bugs and Features</h1>
        </div>
        
        <Tabs defaultValue="features">
          <TabsList className="bg-foreground/5">
            <TabsTrigger 
              value="features" 
              className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent"
            >
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="bugs" 
              className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent"
            >
              Bugs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="mt-6">
            <FeaturesTab />
          </TabsContent>
          
          <TabsContent value="bugs" className="mt-6">
            <BugsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}