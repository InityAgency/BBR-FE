"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { StatsCards, LineChart, BarChart, PieChart, RecentActivity } from "@/components/web/Dashboard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, BarChart2, Users, TrendingUp, Home, MessageSquare, Trophy, Zap, Globe, Search, Sparkles, UserCheck } from "lucide-react";

export default function DeveloperDashboard() {
    const { user, refreshUser } = useAuth();
    const { data, loading, error } = useDashboardData();

    // Dodajemo benefits niz
    const benefits = [
        {
            title: "Includes all Basic Plan features",
            desc: "Everything from the free plan, plus more.",
            icon: <Star className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "Enhanced Property Listings",
            desc: "Showcase your brand with premium listing options.",
            icon: <Home className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "Access Buyer Leads",
            desc: "Get leads from buyers who inquire through our platform.",
            icon: <Users className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "Advanced SEO & Analytics",
            desc: "Boost traffic with advanced SEO and performance analytics.",
            icon: <Search className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "Easy Inventory Upload",
            desc: "Easily upload inventory for visitors to view and inquire about.",
            icon: <BarChart2 className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "Exclusive BBR Offers",
            desc: "Highlight units with exclusive BBR offers for our visitors.",
            icon: <Zap className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "AI-Driven Insights",
            desc: "Get AI-driven insights to improve performance and lead generation.",
            icon: <Sparkles className="h-4 w-4 text-[#B3804C]" />,
        },
        {
            title: "Expert Marketing Support",
            desc: "Receive expert support from a dedicated marketing consultant.",
            icon: <UserCheck className="h-4 w-4 text-[#B3804C]" />,
        },
    ];

    useEffect(() => {
        refreshUser();
    }, []);

    if (loading) {
        return (
            <div className="w-full space-y-6">
                <h2 className="text-xl font-bold sm:text-2xl text-sans">Welcome, {user?.fullName}</h2>

                {/* Loading skeletons */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg border p-6">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="rounded-lg border p-6">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="w-full space-y-6">
                <h2 className="text-xl font-bold sm:text-2xl text-sans">Welcome, {user?.fullName}</h2>
                <div className="rounded-lg border p-6 text-center">
                    <p className="text-muted-foreground">{error || "Greška pri učitavanju podataka"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 py-8">
            <h2 className="text-xl font-bold sm:text-2xl text-sans">Welcome, {user?.fullName}</h2>

            {/* Statistike kartice */}
            <StatsCards stats={data.stats} />

            {/* Banner for Free plan */}
            {user?.company && (user.company as any).plan?.name === "Free" && (
                <div className="gap-3 relative flex flex-col justify-between shadow-xl rounded-lg p-4 h-full bg-[#F7E6D4] text-black border-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        {/* Levi deo: badge, naslov, opis, dugme */}
                        <div className="flex flex-col gap-2 flex-1 min-w-1/3">
                            <div className="flex items-start gap-1">
                                <span className="p-1 rounded-full bg-[#B3804C]/20 flex items-center justify-center">
                                    <svg xmlns='http://www.w3.org/2000/svg' className="h-4 w-4 text-[#B3804C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                </span>
                                <span className="inline-block bg-[#B3804C] text-white text-xs font-semibold px-2 py-0.5 rounded-full">Free plan</span>
                            </div>
                            <h3 className="text-2xl font-bold font-serif custom-card-title mb-1">Upgrade to Premium</h3>
                            <p className="text-md text-inherit opacity-90 mb-1 max-w-xl">
                                Unlock exclusive features and boost your business. Ideal for developers ready to invest in premium marketing strategies.
                            </p>
                            <a href="/developer/billing/upgrade" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit">
                                Upgrade to Premium
                            </a>
                        </div>
                        {/* Desni deo: benefiti */}
                        <div className="grid grid-cols-2 gap-2 bg-white/30 border border-white bg-blur p-2 rounded-lg min-w-[220px] min-w-1/2 w-full">

                            {benefits.map((benefit) => (
                                <div className="flex items-start gap-2 p-1 rounded" key={benefit.title}>
                                    <span className="p-1 rounded-full bg-[#B3804C]/20 flex items-center justify-center">
                                        {benefit.icon}
                                    </span>
                                    <div>
                                        <div className="font-medium text-sm">{benefit.title}</div>
                                        <div className="text-xs text-black/80">{benefit.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Grafovi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                    data={data.trendData.map(item => ({
                        date: item.date,
                        leads: item.leads,
                        views: item.reviews
                    }))}
                    title="Leads and Reviews Trend (last 7 months)"
                />
                <BarChart
                    data={data.topResidencesData
                        .sort((a, b) => b.rankingScore - a.rankingScore)
                        .slice(0, 5)
                        .map(item => ({
                            name: item.name,
                            rankingScore: Number(item.rankingScore?.toFixed(2) ?? 0)
                        }))}
                    title="Top Residences by Ranking Score"
                />
            </div>


            {/* Informacije o kompaniji */}
            <div className="rounded-lg p-6 shadow-sm bg-secondary">
                <h3 className="text-xl font-semibold mb-4 text-sans">Company Information</h3>
                {user?.company ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Leva kolona: Kompanija */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                {user.company.image && (
                                    <img
                                        src={`/api/v1/media/${user.company.image.id}/content`}
                                        alt={user.company.name}
                                        className="w-12 h-12 object-contain rounded-md border"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{user.company.name}</p>
                                    {user.company.plan && (
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${user.company.plan.name === 'Premium'
                                                ? 'bg-[#B3804C] text-white'
                                                : 'bg-gray-300 text-black'
                                            }`}>
                                            {user.company.plan.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p><strong>Address:</strong> {user.company.address}</p>
                            <p><strong>Website:</strong>
                                <a
                                    href={user.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#B3804C] underline ml-1"
                                >
                                    {user.company.website}
                                </a>
                            </p>
                            <p><strong>Phone:</strong> {user.company.phoneNumberCountryCode} {user.company.phoneNumber}</p>
                        </div>

                        {/* Desna kolona: Kontakt osoba */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                {user.company.contactPersonAvatar && (
                                    <img
                                        src={`/api/v1/media/${user.company.contactPersonAvatar.id}/content`}
                                        alt={user.company.contactPersonFullName}
                                        className="w-12 h-12 object-cover rounded-md border"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{user.company.contactPersonFullName}</p>
                                    <p className="text-xs text-muted-foreground">{user.company.contactPersonJobTitle}</p>
                                </div>
                            </div>
                            <p><strong>Email:</strong>
                                <a
                                    href={`mailto:${user.company.contactPersonEmail}`}
                                    className="text-[#B3804C] underline ml-1"
                                >
                                    {user.company.contactPersonEmail}
                                </a>
                            </p>
                            <p><strong>Phone:</strong> {user.company.contactPersonPhoneNumberCountryCode} {user.company.contactPersonPhoneNumber}</p>
                        </div>
                    </div>
                ) : (
                    <p>No company information available.</p>
                )}
            </div>
        </div>
    );
}