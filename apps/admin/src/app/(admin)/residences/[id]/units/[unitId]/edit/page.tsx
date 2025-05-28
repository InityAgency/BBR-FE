"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "../../../../../AdminLayout";
import UnitForm from "@/components/admin/Residences/Units/UnitForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";

export default function EditUnitPage() {
  const params = useParams();
  const unitId = params.unitId as string; // Koristi unitId parametar umesto id
  const residenceId = params.id as string; // residenceId iz [id] foldera
  
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/units/${unitId}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch unit');
        }

        const data = await response.json();
        setUnitData(data.data);
      } catch (error) {
        toast.error('Failed to load unit data');
        console.error('Error fetching unit:', error);
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchUnit();
    }
  }, [unitId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <UnitForm 
        initialData={{
          ...(unitData || {}),
          residenceId: residenceId,
        }} 
        isEditing={true} 
      />
    </AdminLayout>
  );
}