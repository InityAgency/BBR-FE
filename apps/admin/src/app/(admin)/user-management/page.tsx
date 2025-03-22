"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { UsersTable } from "@/components/admin/Users/Table/UsersTable";
import AdminLayout from "../AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { User } from "@/app/types/models/User";

const ITEMS_PER_PAGE = 10;

interface UsersApiResponse {
  data: User[];
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

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch funkcija za dohvatanje korisnika
  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/users?limit=${ITEMS_PER_PAGE}&page=${page}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(`Error fetching users: ${response.status}`);
      }
      
      const data: UsersApiResponse = await response.json();
      
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, []);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchUsers(prevPage);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
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
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
      />
    </AdminLayout>
  );
}
