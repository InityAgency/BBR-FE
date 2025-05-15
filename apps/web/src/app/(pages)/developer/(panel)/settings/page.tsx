"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Notifications from "@/app/(pages)/buyer/(panel)/notifications/page";
import Security from "@/app/(pages)/buyer/(panel)/security/page";
import PersonalInformation from "@/app/(pages)/buyer/(panel)/personal-information/page";
import CompanyInformation from "@/components/web/Panel/Developer/Forms/CompanyInformation/CompanyInformation";
export default function DeveloperSettingsPage() {
    return (
        <div className="w-full py-8 xl:max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl text-sans font-bold text-left">Account Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account information and preferences.
                </p>
            </div>
            
            <Tabs defaultValue="company" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-secondary">
                    <TabsTrigger value="company">Company Information</TabsTrigger>
                    <TabsTrigger value="user">User Information</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="company">
                   <CompanyInformation />
                </TabsContent>

                <TabsContent value="user">
                </TabsContent>

                <TabsContent value="notifications">
                    <Notifications />
                </TabsContent>

                <TabsContent value="security">
                    <Security />
                </TabsContent>
            </Tabs>
        </div>
    );
}