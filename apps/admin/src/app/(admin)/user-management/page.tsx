"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { UsersTable } from "@/components/admin/Users/Table/UsersTable";
import AdminLayout from "../AdminLayout";
import { User } from "@/lib/api/services/types";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const ITEMS_PER_PAGE = 10;

interface UsersApiResponse {
  data: User[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RolesApiResponse {
  data: Role[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("query") || "";

  // Parse status and roleId from URL parameters
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    const roleIdValues = searchParams.getAll("roleId");
    
    setSelectedStatuses(statusValues);
    setSelectedRoleIds(roleIdValues);
  }, [searchParams]);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/roles`);
      url.searchParams.set("limit", "100");
      url.searchParams.set("page", "1");

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching roles: ${response.status}`);
      }

      const data: RolesApiResponse = await response.json();
      setRoles(data.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchUsers = async (
    page: number,
    query?: string,
    statuses?: string[],
    roleIds?: string[]
  ) => {
    try {
      setLoading(true);

      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/users`);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", ITEMS_PER_PAGE.toString());

      if (query && query.trim() !== "") {
        url.searchParams.set("query", query);
      }

      if (statuses && statuses.length > 0) {
        statuses.forEach((status) => {
          url.searchParams.append("status", status);
        });
      }

      if (roleIds && roleIds.length > 0) {
        roleIds.forEach((roleId) => {
          url.searchParams.append("roleId", roleId);
        });
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching users: ${response.status}`);
      }

      const data: UsersApiResponse = await response.json();

      const validTotal =
        typeof data.pagination.total === "number" && data.pagination.total >= 0;

      if (!validTotal) {
        throw new Error("Invalid pagination data received from server");
      }

      setUsers(data.data || []);
      setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      setTotalItems(data.pagination.total);
      
      // Update URL to reflect the API's returned page, preserving filters
      const apiPage = data.pagination.page || page;
      if (apiPage !== page) {
        updateUrlParams({ page: apiPage });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const updateUrlParams = (params: {
    page?: number;
    query?: string;
    statuses?: string[];
    roleIds?: string[];
  }) => {
    const newParams = new URLSearchParams();

    // Always set page
    newParams.set("page", (params.page ?? currentPage).toString());

    // Set query if provided or preserve existing
    if (params.query !== undefined) {
      if (params.query.trim() !== "") {
        newParams.set("query", params.query);
      }
    } else if (queryParam) {
      newParams.set("query", queryParam);
    }

    // Set statuses if provided or preserve existing
    if (params.statuses !== undefined) {
      params.statuses.forEach((status) => {
        newParams.append("status", status);
      });
    } else {
      selectedStatuses.forEach((status) => {
        newParams.append("status", status);
      });
    }

    // Set roleIds if provided or preserve existing
    if (params.roleIds !== undefined) {
      params.roleIds.forEach((roleId) => {
        newParams.append("roleId", roleId);
      });
    } else {
      selectedRoleIds.forEach((roleId) => {
        newParams.append("roleId", roleId);
      });
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch users when page, query, statuses, or roleIds change
  useEffect(() => {
    if (currentPage >= 1) {
      fetchUsers(
        currentPage,
        queryParam || undefined,
        selectedStatuses,
        selectedRoleIds
      );
    }
  }, [currentPage, queryParam, selectedStatuses, selectedRoleIds]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      updateUrlParams({ page: currentPage + 1 });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      updateUrlParams({ page: currentPage - 1 });
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateUrlParams({ page });
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        buttonText="Add New User"
        buttonUrl="/user-management/create"
        count={totalItems}
      />
      <UsersTable
        users={users}
        roles={roles}
        loading={loading || rolesLoading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedRoleIds={selectedRoleIds}
        onRoleIdsChange={setSelectedRoleIds}
      />
    </AdminLayout>
  );
}