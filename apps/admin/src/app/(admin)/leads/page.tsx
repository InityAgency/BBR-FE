"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminLayout from "../AdminLayout";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { LeadsTable } from "@/components/admin/Leads/Table/LeadsTable";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Lead } from "@/app/types/models/Lead";
import { LeadsStatsCards } from "@/components/admin/Leads/Cards/LeadsStatsCards";

const ITEMS_PER_PAGE = 10;

interface LeadsApiResponse {
  data: Lead[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    // contacted: 0,
    // qualified: 0,
    won: 0,
    lost: 0,
    // inactive: 0,
    conversationRate: 0,
  });

  // Citanje query parametara iz URL-a
  const page = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("query") || "";

  const fetchLeads = async (page: number, query?: string, statuses?: string[]) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (query) {
        params.set("query", query);
      }
      if (statuses && statuses.length > 0) {
        statuses.forEach((status) => params.append("status", status));
      }

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/leads?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data: LeadsApiResponse = await response.json();
      setLeads(data.data);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistike za sve leadove
  const fetchLeadsStats = async () => {
    try {
      console.log("fetchLeadsStats called");
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "10000");
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/leads?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      const leads = data.data || [];
      console.log("Leads for stats:", leads);
      const statusCount = {
        NEW: 0,
        // CONTACTED: 0,
        // QUALIFIED: 0,
        WON: 0,
        LOST: 0,
        // INACTIVE: 0,
      };
      leads.forEach((lead: Lead) => {
        if (statusCount[lead.status as keyof typeof statusCount] !== undefined) {
          statusCount[lead.status as keyof typeof statusCount]++;
        }
      });
      const total = leads.length;
      const conversationRate =
        statusCount.WON + statusCount.LOST > 0
          ? Math.round((statusCount.WON / (statusCount.WON + statusCount.LOST)) * 100)
          : 0;
      setStats({
        total,
        new: statusCount.NEW,
        // contacted: statusCount.CONTACTED,
        // qualified: statusCount.QUALIFIED,
        won: statusCount.WON,
        lost: statusCount.LOST,
        // inactive: statusCount.INACTIVE,
        conversationRate,
      });
    } catch (e) {
      setStats({
        total: 0,
        new: 0,
        // contacted: 0,
        // qualified: 0,
        won: 0,
        lost: 0,
        // inactive: 0,
        conversationRate: 0,
      });
    }
  };

  useEffect(() => {
    fetchLeads(page, query, selectedStatuses);
    fetchLeadsStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, selectedStatuses]);

  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      updateUrlParams({ page: (currentPage + 1).toString() });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      updateUrlParams({ page: (currentPage - 1).toString() });
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateUrlParams({ page: page.toString() });
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Leads"
        count={totalItems}
        buttonText="Add new lead"
        buttonUrl="/leads/create"
      />

      <LeadsStatsCards stats={{
        total: stats.total,
        new: stats.new,
        contacted: 0,
        qualified: 0,
        won: stats.won,
        lost: stats.lost,
        inactive: 0,
        conversationRate: stats.conversationRate
      }} />

      <LeadsTable
        leads={leads}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        fetchLeads={fetchLeads}
      />
    </AdminLayout>
  );
}
