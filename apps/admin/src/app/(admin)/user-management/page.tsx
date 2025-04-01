"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { UsersTable } from "@/components/admin/Users/Table/UsersTable";
import AdminLayout from "../AdminLayout";
import { User } from "@/lib/api/services/types";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { usersService } from "@/lib/api/services/users.service";
const ITEMS_PER_PAGE = 10;

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
        throw new Error(`Error fetching users: ${response.status}`);
      }

      const data = await response.json();

      // Validate pagination data
      const validTotal = typeof data.pagination.total === 'number' && data.pagination.total >= 0;
      const validTotalPages = typeof data.pagination.totalPages === 'number' && data.pagination.totalPages >= 0;
      
      if (!validTotal || !validTotalPages) {
        throw new Error('Invalid pagination data received from server');
      }

      setUsers(data.data || []);
      setTotalPages(Math.max(1, data.pagination.totalPages));
      setTotalItems(data.pagination.total);
      setCurrentPage(data.pagination.page || page);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]); // Re-fetch when page changes

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
