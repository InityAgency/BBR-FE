"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/admin/Headers/PageHeader";
import { UsersTable } from "@/components/admin/Users/Table/UsersTable";
import AdminLayout from "../AdminLayout";
import { User } from "@/lib/api/services/types";
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
      const response = await usersService.getUsers({ limit: ITEMS_PER_PAGE, page });
     
      setUsers(response.data); 
      setTotalPages(response.pagination?.totalPages || 1);  
      setTotalItems(response.pagination?.total || 0);

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
