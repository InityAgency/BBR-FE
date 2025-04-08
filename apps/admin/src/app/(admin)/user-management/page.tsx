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

  // Parsiramo status iz URL parametara
  useEffect(() => {
    const statusValues = searchParams.getAll("status");
    if (statusValues.length > 0) {
      setSelectedStatuses(statusValues);
    }
  }, [searchParams]);

  // Parsiramo roleId iz URL parametara
  useEffect(() => {
    const roleIdValues = searchParams.getAll("roleId");
    if (roleIdValues.length > 0) {
      setSelectedRoleIds(roleIdValues);
    }
  }, [searchParams]);

  // Učitavamo uloge sa API-a
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

      if (query) {
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
    statuses?: string[];
    roleIds?: string[];
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.page !== undefined) {
      newParams.set("page", params.page.toString());
    }

    if (params.statuses !== undefined) {
      newParams.delete("status");
      if (params.statuses && params.statuses.length > 0) {
        params.statuses.forEach((status) => {
          newParams.append("status", status);
        });
      }
    }

    if (params.roleIds !== undefined) {
      newParams.delete("roleId");
      if (params.roleIds && params.roleIds.length > 0) {
        params.roleIds.forEach((roleId) => {
          newParams.append("roleId", roleId);
        });
      }
    }

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Efekat za učitavanje uloga
  useEffect(() => {
    fetchRoles();
  }, []);

  // Efekat za ažuriranje URL-a kada se promene statusi
  useEffect(() => {
    if (selectedStatuses.length > 0) {
      updateUrlParams({ statuses: selectedStatuses, page: 1 });
    }
  }, [selectedStatuses]);

  // Efekat za ažuriranje URL-a kada se promene uloge
  useEffect(() => {
    if (selectedRoleIds.length > 0) {
      updateUrlParams({ roleIds: selectedRoleIds, page: 1 });
    }
  }, [selectedRoleIds]);

  // Efekat za učitavanje korisnika
  useEffect(() => {
    fetchUsers(
      currentPage,
      queryParam,
      searchParams.getAll("status"),
      searchParams.getAll("roleId")
    );
  }, [currentPage, queryParam, searchParams]);

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