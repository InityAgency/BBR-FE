"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Bell, Settings, CheckCircle, AlertCircle, Shield, Heart, User, Phone, Mail, Calendar, DollarSign, MapPin, Home } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function BuyerDashboard() {
    const { user, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        refreshUser();
    }, []);

    // Helper function for API requests
    const apiRequest = async (endpoint: string, method: string, data?: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

        const response = await fetch(`${baseUrl}/api/${apiVersion}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        return await response.json();
    };

    const handleNotificationToggle = async (field: string, value: boolean) => {
        setIsLoading(true);
        try {
            const updateData = { [field]: value };
            await apiRequest('users/me', 'PUT', updateData);
            await refreshUser(); // Refresh user data to get updated values
            toast.success('Notification preference updated successfully');
        } catch (error) {
            console.error('Error updating notification preference:', error);
            toast.error('Failed to update notification preference');
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number | null | undefined): string => {
        if (!amount) return 'Not set';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    return (
        <div className="py-8 w-full">
            <div className="mb-8">
                <div className="flex items-center justify-between text-sans">
                    <div>
                        <h1 className="text-2xl text-sans font-bold text-left mb-2">
                            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-muted-foreground">Manage your luxury property preferences and stay updated</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 w-full">
                <div className="rounded-md px-4 py-3 w-full bg-secondary">
                    <div className="flex items-center h-full gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${user?.status === 'ACTIVE' ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                            {user?.status === 'ACTIVE' ?
                                <CheckCircle className="w-5 h-5 text-primary" /> :
                                <AlertCircle className="w-5 h-5 text-gray-600" />
                            }
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                            <p className={`font-semibold ${user?.status === 'ACTIVE' ? 'text-white' : 'text-gray-600'
                                }`}>
                                {user?.status}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-md px-4 py-3 w-full">
                    <div className="flex items-center h-full gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Verification</p>
                            <p className={`font-semibold ${user?.emailVerified ? 'text-white' : 'text-orange-600'
                                }`}>
                                {user?.emailVerified ? 'Verified' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-md px-4 py-3 w-full">
                    <div className="flex items-center h-full gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Preferences</p>
                            <p className="font-semibold text-white">
                                {user?.buyer?.lifestyles?.length || 0} Set
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-md px-4 py-3 w-full">
                    <div className="flex items-center h-full gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Insights</p>
                            <p className="font-semibold text-white">
                                {user?.receiveLuxuryInsights ? 'Enabled' : 'Disabled'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary rounded-lg p-4 shadow-sm   hover:shadow-md transition-shadow">
                        <div className="text-left mb-6 flex flex-col lg:flex-row items-center gap-4">
                            <div className="relative inline-block">
                                {user?.buyer?.image_id ? (
                                    <img
                                        src={`/api/v1/media/${user.buyer.image_id}/content`}
                                        alt={user.fullName}
                                        className="w-16 h-16 rounded-md border-4 border-white/15 shadow-lg object-cover mx-auto"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto shadow-lg">
                                        <User className="w-12 h-12 text-white/15" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-bold text-sans">{user?.fullName}</h2>
                                <p className="text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-md border">
                                <Phone className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-medium text-white">{user?.buyer?.phoneNumber}</p>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-md border">
                                <Mail className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-medium text-white">{user?.buyer?.preferredContactMethod}</p>
                                    <p className="text-sm text-muted-foreground">Preferred Contact</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-md border">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-medium text-white">
                                        {formatDate(user?.createdAt)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Member Since</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Budget & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-secondary rounded-lg p-4 shadow-sm   hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-white text-sans">Budget Range</h3>
                            </div>
                            <div className="text-center p-4 rounded-md border">
                                <p className="text-2xl font-bold text-white">
                                    {formatCurrency(user?.buyer?.budgetRangeFrom)}
                                </p>
                                <p className="text-muted-foreground my-2">to</p>
                                <p className="text-2xl font-bold text-white">
                                    {formatCurrency(user?.buyer?.budgetRangeTo)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary rounded-lg p-4 shadow-sm   hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-white text-sans">Location</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-md border">
                                    <p className="font-medium text-white">
                                        {user?.buyer?.currentLocation?.name || 'Not specified'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Current Location</p>
                                </div>
                                <div className="p-3 rounded-md border">
                                    <p className="font-medium text-white">
                                        {user?.buyer?.preferredResidenceLocation?.name || 'Not specified'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Preferred Location</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unit Types */}
                    <div className="bg-secondary rounded-lg p-4 shadow-sm   hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-white text-sans">Property Preferences</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium text-white mb-3">Unit Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {user?.buyer?.unitTypes?.length ? (
                                        user.buyer.unitTypes.map((unitType) => (
                                            <span
                                                key={unitType.id}
                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                            >
                                                {unitType.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground italic">No unit types selected</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lifestyle Preferences */}
                    <div className="bg-secondary rounded-lg p-4 shadow-sm   hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-white text-sans">Lifestyle Preferences</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user?.buyer?.lifestyles?.length ? (
                                user.buyer.lifestyles.map((lifestyle) => (
                                    <div
                                        key={lifestyle.id}
                                        className="p-3 rounded-md border"
                                    >
                                        <p className="font-medium text-white">{lifestyle.name}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 italic">No lifestyle preferences set</p>
                                    <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        Add Preferences
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-secondary rounded-lg p-4 shadow-sm   hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Bell className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-white text-sans">Notification Preferences</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 rounded-md border">
                                <span className="text-white">Luxury Insights</span>
                                <Switch
                                    checked={user?.receiveLuxuryInsights || false}
                                    onCheckedChange={(checked) => handleNotificationToggle('receiveLuxuryInsights', checked)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border">
                                <span className="text-white">Push Notifications</span>
                                <Switch
                                    checked={user?.pushNotifications || false}
                                    onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border">
                                <span className="text-white">Email Notifications</span>
                                <Switch
                                    checked={user?.emailNotifications || false}
                                    onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', checked)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border">
                                <span className="text-white">Market Trends</span>
                                <Switch
                                    checked={user?.notifyMarketTrends || false}
                                    onCheckedChange={(checked) => handleNotificationToggle('notifyMarketTrends', checked)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}