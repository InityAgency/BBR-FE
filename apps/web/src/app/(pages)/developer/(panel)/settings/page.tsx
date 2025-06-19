"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Notifications from "@/app/(pages)/buyer/(panel)/notifications/page";
import Security from "@/app/(pages)/buyer/(panel)/security/page";
import PersonalInformation from "@/app/(pages)/buyer/(panel)/personal-information/page";
import CompanyInformation from "@/components/web/Panel/Developer/Forms/CompanyInformation/CompanyInformation";
import PersonalInformationDeveloper from "@/components/web/Panel/Developer/Forms/PersonalInformationDeveloper";

export default function DeveloperSettingsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl text-sans font-bold text-left">Account Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account information and preferences.
                    </p>
                </div>
                
                <Tabs defaultValue="company" className="w-full">
                    <TabsList className="h-auto bg-secondary border">
                        <TabsTrigger 
                            value="company" 
                            className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4"
                        >
                            Company Information
                        </TabsTrigger>
                        <TabsTrigger 
                            value="user" 
                            className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4"
                        >
                            User Information
                        </TabsTrigger>
                        <TabsTrigger 
                            value="notifications" 
                            className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4"
                        >
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger 
                            value="security" 
                            className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4"
                        >
                            Security
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="company" className="mt-6">
                        <CompanyInformation />
                    </TabsContent>

                    <TabsContent value="user" className="mt-6">
                        <PersonalInformationDeveloper />
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-6">
                        <Notifications />
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                        <Security />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}