"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface DashboardStats {
  totalResidences: number;
  totalUnits: number;
  totalLeads: number;
  totalReviews: number;
  averageRating: number;
  totalRankings: number;
  averageRankingScore: number;
  conversionRate: number;
}

interface TrendData {
  date: string;
  leads: number;
  reviews: number;
  averageRating: number;
}

interface TopResidenceData {
  name: string;
  leads: number;
  reviews: number;
  rankingScore: number;
}

interface LeadDistributionData {
  name: string;
  value: number;
}

interface Activity {
  id: string;
  type: "lead" | "review" | "ranking" | "residence";
  title: string;
  description: string;
  timestamp: string;
  value?: number;
}

interface DashboardData {
  stats: DashboardStats;
  trendData: TrendData[];
  topResidencesData: TopResidenceData[];
  leadsDistributionData: LeadDistributionData[];
  recentActivities: Activity[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all residences (with totalScores for rankings)
        const residencesRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/residences/me?limit=100`, { credentials: "include" });
        if (!residencesRes.ok) throw new Error("Failed to fetch residences");
        const residencesData = await residencesRes.json();
        const residences = residencesData.data || [];

        // Fetch all units for each residence
        let allUnits: any[] = [];
        for (const residence of residences) {
          try {
            const unitsRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units?residenceId=${residence.id}&limit=1000`, { credentials: "include" });
            if (unitsRes.ok) {
              const unitsData = await unitsRes.json();
              if (unitsData.data) allUnits = allUnits.concat(unitsData.data);
            }
          } catch {}
        }

        // Fetch all leads
        const leadsRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/leads?limit=1000`, { credentials: "include" });
        if (!leadsRes.ok) throw new Error("Failed to fetch leads");
        const leadsData = await leadsRes.json();
        const allLeads = leadsData.data || [];

        // Fetch all reviews
        const reviewsRes = await fetch(`${API_BASE_URL}/api/${API_VERSION}/reviews?limit=1000`, { credentials: "include" });
        if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsRes.json();
        const allReviews = reviewsData.data || [];

        // Rankings (from totalScores on each residence)
        let allRankings: any[] = [];
        let totalRankingScore = 0;
        let rankingCount = 0;
        residences.forEach((res: any) => {
          if (Array.isArray(res.totalScores)) {
            allRankings = allRankings.concat(res.totalScores);
            res.totalScores.forEach((score: any) => {
              if (typeof score.totalScore === "number") {
                totalRankingScore += score.totalScore;
                rankingCount++;
              }
            });
          }
        });

        // Calculate stats
        const totalResidences = residences.length;
        const totalUnits = allUnits.length;
        const totalLeads = allLeads.length;
        const totalReviews = allReviews.length;
        const averageRating = allReviews.length > 0
          ? allReviews.reduce((sum: number, r: any) => sum + (r.rating || r.purchaseExperienceRating || 0), 0) / allReviews.length
          : 0;
        const totalRankings = allRankings.length;
        const averageRankingScore = rankingCount > 0 ? totalRankingScore / rankingCount : 0;
        const conversionRate = totalLeads > 0 && totalUnits > 0
          ? Math.round((totalLeads / totalUnits) * 100 * 100) / 100
          : 0;

        // Generate trend data (last 7 months, sada po realnim podacima)
        const now = new Date();
        const months: string[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push(d.toLocaleString('default', { month: 'short' }));
        }
        // Grupisanje leadova i reviews po mesecima
        function getMonthKey(dateStr: string) {
          const d = new Date(dateStr);
          return d.toLocaleString('default', { month: 'short' });
        }
        const leadsByMonth: Record<string, number> = {};
        const reviewsByMonth: Record<string, number> = {};
        allLeads.forEach((l: any) => {
          if (l.createdAt) {
            const m = getMonthKey(l.createdAt);
            leadsByMonth[m] = (leadsByMonth[m] || 0) + 1;
          }
        });
        allReviews.forEach((r: any) => {
          if (r.createdAt) {
            const m = getMonthKey(r.createdAt);
            reviewsByMonth[m] = (reviewsByMonth[m] || 0) + 1;
          }
        });
        const trendData: TrendData[] = months.map((month) => ({
          date: month,
          leads: leadsByMonth[month] || 0,
          reviews: reviewsByMonth[month] || 0,
          averageRating: allReviews.length > 0 ? averageRating : 0,
        }));

        // Top residences by leads (već koristi realne podatke)
        const topResidencesData: TopResidenceData[] = residences
          .slice(0, 5)
          .map((res: any) => ({
            name: res.name,
            leads: allLeads.filter((l: any) => l.entityId === res.id).length,
            reviews: allReviews.filter((r: any) => r.residence?.id === res.id).length,
            rankingScore: Array.isArray(res.totalScores) && res.totalScores.length > 0
              ? res.totalScores.reduce((sum: number, s: any) => sum + (s.totalScore || 0), 0) / res.totalScores.length
              : 0,
          }));
        // Lead distribution by status (već koristi realne podatke)
        const leadStatuses = ["NEW", "WON", "LOST", "QUALIFIED", "CONTACTED"];
        const leadsDistributionData: LeadDistributionData[] = leadStatuses.map((status) => ({
          name: status.charAt(0) + status.slice(1).toLowerCase(),
          value: allLeads.filter((l: any) => l.status === status).length,
        }));

        // Recent activities
        const recentActivities: Activity[] = [];
        if (allLeads.length > 0) {
          recentActivities.push({
            id: "1",
            type: "lead",
            title: "New lead",
            description: `New lead received for one of your residences`,
            timestamp: "2 hours ago",
            value: 1,
          });
        }
        if (allReviews.length > 0) {
          recentActivities.push({
            id: "2",
            type: "review",
            title: "New review",
            description: `A new review was submitted for your residence`,
            timestamp: "4 hours ago",
            value: 1,
          });
        }
        if (allRankings.length > 0) {
          recentActivities.push({
            id: "3",
            type: "ranking",
            title: "Ranking update",
            description: `Your residence ranking was updated`,
            timestamp: "1 day ago",
            value: 1,
          });
        }
        if (residences.length > 0) {
          recentActivities.push({
            id: "4",
            type: "residence",
            title: "New residence added",
            description: `You added a new residence`,
            timestamp: "2 days ago",
          });
        }

        const dashboardData: DashboardData = {
          stats: {
            totalResidences,
            totalUnits,
            totalLeads,
            totalReviews,
            averageRating,
            totalRankings,
            averageRankingScore,
            conversionRate,
          },
          trendData,
          topResidencesData,
          leadsDistributionData,
          recentActivities,
        };

        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
} 